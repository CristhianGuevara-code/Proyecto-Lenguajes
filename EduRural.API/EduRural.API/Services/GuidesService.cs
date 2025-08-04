using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Guides;
using EduRural.API.Dtos.Users;
using EduRural.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;
//using System.Net;

namespace EduRural.API.Services
{
    public class GuidesService : IGuidesService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public GuidesService(EduRuralDbContext context, IMapper mapper, 
            IConfiguration configuration, IAuditService auditService)
        {
            _context = context;
            _mapper = mapper;
            _auditService = auditService;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<GuideDto>>>> GetListAsync(
              string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<GuideEntity> guideQuery = _context.Guides;

            if (!string.IsNullOrEmpty(searchTerm)) //si el termino de busqueda es diferente a vacio o nulo
            {
                guideQuery = guideQuery.Where
                    (x => (x.Title).Contains(searchTerm));
            }

            int totalRows = await guideQuery.CountAsync();

            var guidesEntity = await guideQuery
                .Include(g => g.Grade)
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
                Message = guidesEntity.Count() > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<GuideDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = guidesDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math
                    .Ceiling((double)(totalRows / pageSize)),

                }
            };
        }

        //public async Task<ResponseDto<List<GuideDto>>> GetListAsync()
        //{
        //    var guides = await _context.Guides
        //        .Include(g => g.Grade)
        //        .Include(g => g.UploadedBy)
        //        .ToListAsync();

        //    return new ResponseDto<List<GuideDto>>
        //    {
        //        StatusCode = HttpStatusCode.OK,
        //        Status = true,
        //        Message = "Registros obtenidos correctamente",
        //        Data = _mapper.Map<List<GuideDto>>(guides)
        //    };
        //}

        public async Task<ResponseDto<GuideDto>> GetOneByIdAsync(string id)
        {
            var guide = await _context.Guides
                .Include(g => g.Grade)
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
           
                // verificar si el grado existe
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
                // verificar si la materia existe
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

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {

                var userId = _auditService.GetUserId();

                var guide = _mapper.Map<GuideEntity>(dto);
                guide.Id = Guid.NewGuid().ToString();
                guide.GradeId = dto.GradeId;
                guide.SubjectId = dto.SubjectId;
                guide.UploadedById = userId;
                guide.UploadDate = DateTime.UtcNow;

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
            
                // buscar la guía
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

                // verificar si el grado existe
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

                // verificar si la materia existe
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

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                // mapear los cambios desde el DTO a la entidad existente
                _mapper.Map(dto, guide);

                // actualizar en la base de datos
                _context.Guides.Update(guide);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // volver a consultar la guía con relaciones para mapear correctamente
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
                _context.Guides.Remove(guide);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();


                var savedGuide = await _context.Guides
                    .Include(g => g.Grade)
                    .Include(g => g.UploadedBy)
                    .FirstOrDefaultAsync(g => g.Id == guide.Id);

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
    }
}
