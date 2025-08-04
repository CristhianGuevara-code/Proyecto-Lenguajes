using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Teachers;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teachersService;

        public TeacherController(ITeacherService teacherService) // inyectar el servicio
        {
            _teachersService = teacherService;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<TeacherDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _teachersService.GetListAsync(searchTerm, page, pageSize);

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
        public async Task<ActionResult<ResponseDto<TeacherDto>>> GetOne(string id)
        {
            var response = await _teachersService.GetOneByIdAsync(id);

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
        public async Task<ActionResult<ResponseDto<TeacherActionResponseDto>>> Post([FromBody] TeacherCreateDto dto)
        {
            Console.WriteLine($"DTO.UserId: {dto.UserId}");

            var response = await _teachersService.CreateAsync(dto);

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
        public async Task<ActionResult<ResponseDto<TeacherActionResponseDto>>> Edit([FromBody] TeacherEditDto dto, string id)
        {
            var response = await _teachersService.EditAsync(dto, id);

            return StatusCode(response.StatusCode, response);
        }

        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<TeacherActionResponseDto>>> Delete(string id)
        {
            var response = await _teachersService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
