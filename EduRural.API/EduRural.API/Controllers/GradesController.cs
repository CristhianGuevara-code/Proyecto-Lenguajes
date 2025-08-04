using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/grades")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class GradesController : ControllerBase
    {
        private readonly IGradesService _gradesService;

        public GradesController(IGradesService gradesService) // inyectar el servicio
        {
            _gradesService = gradesService;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<GradeDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _gradesService.GetListAsync(searchTerm, page, pageSize);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        //Obtener uno
        [HttpGet("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<GradeDto>>> GetOne(string id)
        {
            var response = await _gradesService.GetOneByIdAsync(id);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        //Crear
        [HttpPost]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<GradeActionResponseDto>>> Post([FromBody] GradeCreateDto dto)
        {
            var response = await _gradesService.CreateAsync(dto);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        //Editar
        [HttpPut("{id}")] // Put porque se edita todo
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<GradeActionResponseDto>>> Edit([FromBody] GradeEditDto dto, string id)
        {
            var response = await _gradesService.EditAsync(dto, id);

            return StatusCode(response.StatusCode, response);
        }

        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<GradeActionResponseDto>>> Delete(string id)
        {
            var response = await _gradesService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
