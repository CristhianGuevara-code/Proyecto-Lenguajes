using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Students;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/students")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentsService;

        public StudentController(IStudentService studentsService) // inyectar el servicio
        {
            _studentsService = studentsService;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<StudentDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _studentsService.GetListAsync(searchTerm, page, pageSize);

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
        public async Task<ActionResult<ResponseDto<StudentDto>>> GetOne(string id)
        {
            var response = await _studentsService.GetOneByIdAsync(id);

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
        public async Task<ActionResult<ResponseDto<StudentActionResponseDto>>> Post([FromBody] StudentCreateDto dto)
        {
            var response = await _studentsService.CreateAsync(dto);

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
        public async Task<ActionResult<ResponseDto<StudentActionResponseDto>>> Edit([FromBody] StudentEditDto dto, string id)
        {
            var response = await _studentsService.EditAsync(dto, id);

            return StatusCode(response.StatusCode, response);
        }

        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<StudentActionResponseDto>>> Delete(string id)
        {
            var response = await _studentsService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
