using AutoMapper;
using EduRural.API.Constants;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Guides;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;
using System.Security.Claims;

namespace EduRural.API.Controllers
{
    [Route("api/guides")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]

    public class GuidesController : ControllerBase
    {
        private readonly IGuidesService _guidesService;
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IWebHostEnvironment _env;

        public GuidesController(IGuidesService guidesService, EduRuralDbContext context,
            IMapper mapper, UserManager<UserEntity> userManager, IWebHostEnvironment env) 
        {
            _guidesService = guidesService;
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _env = env;
        }

        // Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<GuideDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                // Log del identity principal
                var name = User.Identity?.Name;  // normalmente debería ser el email o username
                var authHeader = Request.Headers["Authorization"].ToString();
                Console.WriteLine($"Usuario null, Identity.Name: {name}, Authorization Header: {authHeader}");
                return Unauthorized(new { message = "Usuario no autenticado" });
            }
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(user.Id));

            IQueryable<GuideEntity> guideQuery = _context.Guides
                .Include(g => g.Grade)
                .Include(g => g.Subject)
                .Include(g => g.UploadedBy);

            // Filtro por rol
            if (roles.Contains(RolesConstant.PADRE))
            {
                var gradeIds = await _context.Parents
                    .Where(p => p.UserId == user.Id)
                    .SelectMany(p => p.Students.Select(s => s.GradeId))
                    .Distinct()
                    .ToListAsync();

                guideQuery = guideQuery.Where(g => gradeIds.Contains(g.GradeId));
            }
            else if (roles.Contains(RolesConstant.PROFESOR))
            {
                guideQuery = guideQuery.Where(g => g.UploadedById == user.Id);
            }
            // Si es ADMIN, no filtramos

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                guideQuery = guideQuery.Where(x => x.Title.Contains(searchTerm));
            }

            // Paginación
            pageSize = pageSize == 0 ? 10 : pageSize;
            int totalRows = await guideQuery.CountAsync();

            var guidesEntity = await guideQuery
                .OrderBy(x => x.Title)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var guidesDto = _mapper.Map<List<GuideDto>>(guidesEntity);

            var response = new ResponseDto<PaginationDto<List<GuideDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = guidesDto.Count > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<GuideDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = guidesDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = ((page - 1) * pageSize + pageSize) < totalRows
                }
            };

            return StatusCode((int)response.StatusCode, response);
        }


        // Obtener uno
        [HttpGet("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<GuideDto>>> GetOne(string id)
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user);

            var guide = await _context.Guides
                .Include(g => g.Grade)
                .Include(g => g.Subject)
                .Include(g => g.UploadedBy)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (guide == null)
            {
                return StatusCode((int)HttpStatusCode.NOT_FOUND, new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Guía no encontrada",
                    Data = null
                });
            }

            // Filtro de acceso
            if (roles.Contains(RolesConstant.PADRE))
            {
                var gradeIds = await _context.Parents
                    .Where(p => p.UserId == user.Id)
                    .SelectMany(p => p.Students.Select(s => s.GradeId))
                    .Distinct()
                    .ToListAsync();

                if (!gradeIds.Contains(guide.GradeId))
                {
                    return StatusCode((int)HttpStatusCode.FORBIDDEN, new ResponseDto<GuideDto>
                    {
                        StatusCode = HttpStatusCode.FORBIDDEN,
                        Status = false,
                        Message = "No tienes permiso para acceder a esta guía",
                        Data = null
                    });
                }
            }
            else if (roles.Contains(RolesConstant.PROFESOR) && guide.UploadedById != user.Id)
            {
                return StatusCode((int)HttpStatusCode.FORBIDDEN, new ResponseDto<GuideDto>
                {
                    StatusCode = HttpStatusCode.FORBIDDEN,
                    Status = false,
                    Message = "No tienes permiso para acceder a esta guía",
                    Data = null
                });
            }

            var guideDto = _mapper.Map<GuideDto>(guide);

            return StatusCode((int)HttpStatusCode.OK, new ResponseDto<GuideDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Guía encontrada",
                Data = guideDto
            });
        }


        // Crear
        [HttpPost]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Post([FromForm] GuideCreateDto dto)
        {

            var response = await _guidesService.CreateAsync(dto);
            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        // Editar
        [HttpPut("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Edit([FromForm] GuideEditDto dto, string id)
        {

            var response = await _guidesService.EditAsync(dto, id);
            return StatusCode(response.StatusCode, response);
        }


        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Delete(string id)
        {
            var response = await _guidesService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        // EndPoint para descargar los archivos:
        [HttpGet("{id}/download")]
        [Authorize]
        public async Task<IActionResult> Download(string id, [FromQuery] string mode = "download")
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user);

            var guide = await _context.Guides
                    .Include(g => g.Grade)
                    .Include(g => g.UploadedBy)
                    .FirstOrDefaultAsync(g => g.Id == id);
            
            if (guide == null || string.IsNullOrWhiteSpace(guide.FilePath))
            {
                return NotFound(new { message = "Archivo no encontrado" });
            }

            // Validación de roles
            if (roles.Contains(RolesConstant.PADRE))
            {
                var gradeIds = await _context.Parents
                    .Where(p => p.UserId == user.Id)
                    .SelectMany(p => p.Students.Select(s => s.GradeId))
                    .Distinct()
                    .ToListAsync();

                if (!gradeIds.Contains(guide.GradeId))
                {
                    return Forbid();
                }
            }
            else if (roles.Contains(RolesConstant.PROFESOR) && guide.UploadedById != user.Id)
            {
                return Forbid();
            }

            var rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var physicalPath = Path.Combine(rootPath, guide.FilePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (!System.IO.File.Exists(physicalPath))
            {
                return NotFound(new { message = "Archivo no encontrado" });
            }

            var contentType = "application/pdf";
            var fileName = Path.GetFileName(physicalPath);
            var fileBytes = await System.IO.File.ReadAllBytesAsync(physicalPath);

            if (mode.ToLower() == "preview")
            {
                Response.Headers["Content-Disposition"] = $"inline; filename={fileName}";
            }
            else
            {
                Response.Headers["Content-Disposition"] = $"attachment; filename={fileName}";
            }

            return File(fileBytes, contentType);
        }


    }
}
