using EduRural.API.Dtos.Grades;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/grades")]
    [ApiController]
    public class GradesController : ControllerBase
    {
        private readonly IGradesService _gradesService;

        public GradesController(IGradesService gradesService)
        {
            _gradesService = gradesService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<GradeDto>>>> GetAll()
        {
            var response = await _gradesService.GetListAsync();
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<GradeDto>>> GetOne(string id)
        {
            var response = await _gradesService.GetOneByIdAsync(id);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<GradeActionResponseDto>>> Post([FromBody] GradeCreateDto dto)
        {
            var response = await _gradesService.CreateAsync(dto);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<GradeActionResponseDto>>> Edit([FromBody] GradeEditDto dto, string id)
        {
            var response = await _gradesService.EditAsync(dto, id);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<GradeActionResponseDto>>> Delete(string id)
        {
            var response = await _gradesService.DeleteAsync(id);
            return StatusCode((int)response.StatusCode, response);
        }
    }
}
