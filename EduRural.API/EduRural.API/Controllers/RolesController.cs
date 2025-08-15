using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Roles;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/roles")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]

    public class RolesController : ControllerBase
    {
        private readonly IRolesService _rolesService;

        public RolesController(IRolesService rolesService)
        {
            _rolesService = rolesService;
        }

        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<RoleDto>>>>> GetListPagination(
             string searchTerm = "", int page = 1, int pageSize = 10
             )
        {
            var response = await _rolesService.GetListAsync(searchTerm, page, pageSize);

            return StatusCode(response.StatusCode, new ResponseDto<PaginationDto<List<RoleDto>>>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<RoleDto>>> GetOneById(string id)
        {
            var response = await _rolesService.GetOneById(id);
            return StatusCode(response.StatusCode,
                new ResponseDto<RoleDto>
                {
                    Status = response.Status,
                    Message = response.Message,
                    Data = response.Data
                });
        }


        [HttpPost]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<RoleActionResponseDto>>> CreateAsync(RoleCreateDto dto)
        {
            var response = await _rolesService.CreateAsync(dto);
            return StatusCode(response.StatusCode,
                new ResponseDto<RoleActionResponseDto>
                {
                    Status = response.Status,
                    Message = response.Message,
                    Data = response.Data
                });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<RoleActionResponseDto>>> EditAsync(
            [FromBody] RoleEditDto dto, string id)
        {
            var response = await _rolesService.EditAsync(dto, id);
            return StatusCode(response.StatusCode,
                new ResponseDto<RoleActionResponseDto>
                {
                    Status = response.Status,
                    Message = response.Message,
                    Data = response.Data
                });

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<RoleActionResponseDto>>> Delete(string id)
        {
            var response = await _rolesService.DeleteAsync(id);
            return StatusCode(response.StatusCode,
                new ResponseDto<RoleActionResponseDto>
                {
                    Status = response.Status,
                    Message = response.Message,
                    Data = response.Data
                });
        }
    }
}
