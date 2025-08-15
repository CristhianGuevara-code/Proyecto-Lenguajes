using EduRural.API.Constants;
using EduRural.API.Database;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Guides;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/guides")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]

    public class GuidesController : ControllerBase
    {
        private readonly IGuidesService _guidesService;
        private readonly EduRuralDbContext _context;
        private readonly IWebHostEnvironment _env;

        public GuidesController(IGuidesService guidesService, EduRuralDbContext context, IWebHostEnvironment env) 
        {
            _guidesService = guidesService;
            _context = context;
            _env = env;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<GuideDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _guidesService.GetListAsync(searchTerm, page, pageSize);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        //Obtener uno
        [HttpGet("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<GuideDto>>> GetOne(string id)
        {
            var response = await _guidesService.GetOneByIdAsync(id);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
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
            var guide = await _context.Guides.FirstOrDefaultAsync(g => g.Id == id);
            if (guide == null || string.IsNullOrWhiteSpace(guide.FilePath))
            {
                return NotFound(new { message = "Archivo no encontrado" });
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
