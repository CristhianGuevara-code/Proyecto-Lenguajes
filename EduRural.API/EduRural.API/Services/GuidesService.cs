using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Guides;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services
{
    public class GuidesService : IGuidesService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _env;

        private readonly int PAGE_ZISE;        
        private readonly int PAGE_SIZE_LIMIT;

        private static readonly string[] AllowedExtensions = new[]
        {
            ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".png", ".jpg", ".jpeg"
        };

        public GuidesService(
            EduRuralDbContext context,
            IMapper mapper,
            IConfiguration configuration,
            IAuditService auditService,
            IHttpContextAccessor httpContextAccessor,
            IWebHostEnvironment env)
        {
            _context = context;
            _mapper = mapper;
            _auditService = auditService;
            _httpContextAccessor = httpContextAccessor;
            _env = env;

            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<GuideDto>>>> GetListAsync(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize;

            IQueryable<GuideEntity> guideQuery = _context.Guides;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                guideQuery = guideQuery.Where(x => x.Title.Contains(searchTerm));
            }

            int totalRows = await guideQuery.CountAsync();

            var guidesEntity = await guideQuery
                .Include(g => g.Grade)
                .Include(g => g.Subject)
                .Include(g => g.UploadedBy)
                .OrderBy(x => x.Title)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            var guidesDto = _mapper.Map<List<GuideDto>>(guidesEntity);

            return new ResponseDto<PaginationDto<List<GuideDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = guidesEntity.Count > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<GuideDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = guidesDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = (startIndex + pageSize) < totalRows
                }
            };
        }

        public async Task<ResponseDto<GuideDto>> GetOneByIdAsync(string id)
        {
            var guide = await _context.Guides
                .Include(g => g.Grade)
                .Include(g => g.Subject)
                .Include(g => g.UploadedBy)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (guide is null)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada"
                };
            }

            return new ResponseDto<GuideDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Guía encontrada",
                Data = _mapper.Map<GuideDto>(guide)
            };
        }

        public async Task<ResponseDto<GuideDto>> CreateAsync(GuideCreateDto dto)
        {
            // Validaciones de relaciones
            var existsGrade = await _context.Grades.AnyAsync(g => g.Id == dto.GradeId);
            if (!existsGrade)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "El grado no existe"
                };
            }

            var existSubject = await _context.Subjects.AnyAsync(s => s.Id == dto.SubjectId);
            if (!existSubject)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "La materia no existe"
                };
            }

            // Validar archivo
            if (dto.File is null || dto.File.Length == 0)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "Debe adjuntar un archivo."
                };
            }

            var ext = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "Extensión de archivo no permitida."
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Guardar archivo físico y obtener ruta pública
                var (publicPath, _) = await SaveFileAsync(dto.File);

                var userId = _auditService.GetUserId();

                var guide = _mapper.Map<GuideEntity>(dto);
                guide.Id = Guid.NewGuid().ToString();
                guide.UploadedById = userId;
                guide.UploadDate = DateTime.UtcNow;
                guide.FilePath = publicPath; //  ruta pública servible

                _context.Guides.Add(guide);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var savedGuide = await _context.Guides
                    .Include(g => g.Grade)
                    .Include(g => g.UploadedBy)
                    .FirstOrDefaultAsync(g => g.Id == guide.Id);

                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.CREATED,
                    Status = true,
                    Message = "Guía creada correctamente",
                    Data = _mapper.Map<GuideDto>(savedGuide)
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }

        public async Task<ResponseDto<GuideDto>> EditAsync(GuideEditDto dto, string id)
        {
            var guide = await _context.Guides.FindAsync(id);
            if (guide is null)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada"
                };
            }

            // Validar relaciones SOLO si vienen en el DTO
            if (!string.IsNullOrWhiteSpace(dto.GradeId))
            {
                var existsGrade = await _context.Grades.AnyAsync(g => g.Id == dto.GradeId);
                if (!existsGrade)
                {
                    return new ResponseDto<GuideDto>
                    {
                        StatusCode = HttpStatusCode.NOT_FOUND,
                        Status = false,
                        Message = "El grado no existe"
                    };
                }
            }

            if (!string.IsNullOrWhiteSpace(dto.SubjectId))
            {
                var existsSubject = await _context.Subjects.AnyAsync(s => s.Id == dto.SubjectId);
                if (!existsSubject)
                {
                    return new ResponseDto<GuideDto>
                    {
                        StatusCode = HttpStatusCode.NOT_FOUND,
                        Status = false,
                        Message = "La materia no existe"
                    };
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var oldFilePath = guide.FilePath;
                string newPublicPath = null;

                // Si llega archivo nuevo: validar y guardar
                if (dto.File is not null && dto.File.Length > 0)
                {
                    var ext = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
                    if (!AllowedExtensions.Contains(ext))
                    {
                        return new ResponseDto<GuideDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = "Extensión de archivo no permitida."
                        };
                    }

                    var saveResult = await SaveFileAsync(dto.File);
                    newPublicPath = saveResult.publicPath;
                    guide.FilePath = newPublicPath; // reemplaza ruta
                }

                // Actualizar atributos simples solo si vienen
                if (!string.IsNullOrWhiteSpace(dto.Title)) guide.Title = dto.Title;
                if (dto.Description != null) guide.Description = dto.Description;
                if (!string.IsNullOrWhiteSpace(dto.GradeId)) guide.GradeId = dto.GradeId;
                if (!string.IsNullOrWhiteSpace(dto.SubjectId)) guide.SubjectId = dto.SubjectId;

                _context.Guides.Update(guide);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Si hubo archivo nuevo, borrar el archivo anterior (silencioso)
                if (!string.IsNullOrWhiteSpace(newPublicPath) &&
                    !string.IsNullOrWhiteSpace(oldFilePath) &&
                    !oldFilePath.Equals(newPublicPath, StringComparison.OrdinalIgnoreCase))
                {
                    TryDeletePhysicalFile(oldFilePath);
                }

                var savedGuide = await _context.Guides
                    .Include(g => g.Grade)
                    .Include(g => g.UploadedBy)
                    .FirstOrDefaultAsync(g => g.Id == guide.Id);

                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Guía actualizada correctamente",
                    Data = _mapper.Map<GuideDto>(savedGuide)
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }

        public async Task<ResponseDto<GuideDto>> DeleteAsync(string id)
        {
            var guide = await _context.Guides.FindAsync(id);

            if (guide is null)
            {
                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada"
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var oldFilePath = guide.FilePath;

                _context.Guides.Remove(guide);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Borrar archivo físico (si existe)
                TryDeletePhysicalFile(oldFilePath);

                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Guía eliminada correctamente",
                    Data = _mapper.Map<GuideDto>(guide)
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }

        // ================== Helpers de archivo ==================

        private async Task<(string publicPath, string physicalPath)> SaveFileAsync(IFormFile file)
        {
            // Asegurar wwwroot
            var webRoot = _env.WebRootPath;
            if (string.IsNullOrWhiteSpace(webRoot))
            {
                webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            // Crear carpeta destino
            var subfolder = Path.Combine("uploads", "guides");
            var targetDir = Path.Combine(webRoot, subfolder);
            Directory.CreateDirectory(targetDir);

            // Nombre único
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid()}{ext}";

            var physical = Path.Combine(targetDir, fileName);
            using (var stream = new FileStream(physical, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Ruta pública relativa (usada por el cliente)
            var publicRel = $"/{subfolder.Replace("\\", "/")}/{fileName}";
            return (publicRel, physical);
        }

        private void TryDeletePhysicalFile(string publicPath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(publicPath)) return;

                var safe = publicPath.Replace('\\', '/').TrimStart('/');

                var webRoot = _env.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRoot))
                {
                    webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var fullPath = Path.Combine(webRoot, safe);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            catch
            {
                // no interrumpir por error de limpieza
            }
        }
    }
}
