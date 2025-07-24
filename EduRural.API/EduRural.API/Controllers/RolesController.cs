using EduRural.API.Dtos.Roles;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRolesService _rolesService;

        public RolesController(IRolesService rolesService)
        {
            _rolesService = rolesService;
        }

        //[HttpGet]
        //public async Task<ActionResult<ResponseDto<List<RoleDto>>>> GetList()
        //{
        //    var response = await _rolesService.GetListasync(); 

        //    return StatusCode((int)response.StatusCode, new ResponseDto<List<RoleDto>>
        //    {
        //        Status = response.Status,
        //        Message = response.Message,
        //        Data = response.Data
        //    });
        //}

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<RoleDto>>> GetOneById(string id)
        {
            var response = await _rolesService.GetOneByIdAsync(id);
            return StatusCode((int)response.StatusCode, new ResponseDto<RoleDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<RoleActionResponseDto>>> CreateAsync(RoleCreateDto dto)
        {
            var response = await _rolesService.CreateAsync(dto);
            return StatusCode((int)response.StatusCode, new ResponseDto<RoleActionResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<RoleActionResponseDto>>> EditAsync(
            [FromBody] RoleEditDto dto, string id)
        {
            var response = await _rolesService.EditAsync(dto, id);
            return StatusCode((int)response.StatusCode, new ResponseDto<RoleActionResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<RoleActionResponseDto>>> Delete(string id)
        {
            var response = await _rolesService.DeleteAsync(id);
            return StatusCode((int)response.StatusCode, new ResponseDto<RoleActionResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }
    }
}
