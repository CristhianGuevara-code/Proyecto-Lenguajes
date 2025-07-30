using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Guides;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/guides")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]

    public class GuidesController : ControllerBase
    {
        private readonly IGuidesService _guidesService;

        public GuidesController(IGuidesService guidesService) // inyectar el servicio
        {
            _guidesService = guidesService;
        }

        //Obtener lista
        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
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
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
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

        //Crear
        [HttpPost]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Post([FromBody] GuideCreateDto dto)
        {
            var response = await _guidesService.CreateAsync(dto);

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
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Edit([FromBody] GuideEditDto dto, string id)
        {
            var response = await _guidesService.EditAsync(dto, id);

            return StatusCode(response.StatusCode, response);
        }

        //Eliminar
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Delete(string id)
        {
            var response = await _guidesService.DeleteAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
