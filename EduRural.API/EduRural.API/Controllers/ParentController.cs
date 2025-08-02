using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Parents;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/parents")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ParentController : ControllerBase
    {
        private readonly IParentService _parentsService;

        public ParentController(IParentService parentsService) // inyectar el servicio
        {
            _parentsService = parentsService;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<ParentDto>>>>> GetList(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _parentsService.GetListAsync(searchTerm, page, pageSize);

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
        public async Task<ActionResult<ResponseDto<ParentDto>>> GetOne(string id)
        {
            var response = await _parentsService.GetOneByIdAsync(id);

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
        public async Task<ActionResult<ResponseDto<ParentActionResponseDto>>> Post([FromBody] ParentCreateDto dto)
        {
            var response = await _parentsService.CreateAsync(dto);

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
        public async Task<ActionResult<ResponseDto<ParentActionResponseDto>>> Edit([FromBody] ParentEditDto dto, string id)
        {
            var response = await _parentsService.EditAsync(dto, id);

            return StatusCode(response.StatusCode, response);
        }

        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<ParentActionResponseDto>>> Delete(string id)
        {
            var response = await _parentsService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
