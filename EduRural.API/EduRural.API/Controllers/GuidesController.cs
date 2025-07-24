using EduRural.API.Dtos.Guides;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/guides")]
    [ApiController]
    public class GuidesController : ControllerBase
    {
        private readonly IGuidesService _guidesService;

        public GuidesController(IGuidesService guidesService)
        {
            _guidesService = guidesService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<GuideDto>>>> GetAll()
        {
            var response = await _guidesService.GetListAsync();
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<GuideDto>>> GetOne(string id)
        {
            var response = await _guidesService.GetOneByIdAsync(id);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Post([FromBody] GuideCreateDto dto, string userId)
        {
            var response = await _guidesService.CreateAsync(dto, userId);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Edit([FromBody] GuideEditDto dto, string id)
        {
            var response = await _guidesService.EditAsync(dto, id);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<GuideActionResponseDto>>> Delete(string id)
        {
            var response = await _guidesService.DeleteAsync(id);
            return StatusCode((int)response.StatusCode, response);
        }
    }
}
