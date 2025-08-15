using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Subjects;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/subjects")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]

    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _subjectService;

        public SubjectController(ISubjectService subjectService) // inyectar el servicio
        {
            _subjectService = subjectService;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<SubjectDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _subjectService.GetListAsync(searchTerm, page, pageSize);

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
        public async Task<ActionResult<ResponseDto<SubjectDto>>> GetOne(string id)
        {
            var response = await _subjectService.GetOneByIdAsync(id);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        //Crear
        [HttpPost]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<SubjectActionResponseDto>>> Post([FromBody] SubjectCrateDto dto)
        {
            var response = await _subjectService.CreateAsync(dto);

            return StatusCode(response.StatusCode, new
            {
                response.Status,
                response.Message,
                response.Data
            });
        }

        //Editar
        [HttpPut("{id}")] // Put porque se edita todo
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<SubjectActionResponseDto>>> Edit([FromBody] SubjectEditDto dto, string id)
        {
            var response = await _subjectService.EditAsync(dto, id);

            return StatusCode(response.StatusCode, response);
        }

        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<SubjectActionResponseDto>>> Delete(string id)
        {
            var response = await _subjectService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
