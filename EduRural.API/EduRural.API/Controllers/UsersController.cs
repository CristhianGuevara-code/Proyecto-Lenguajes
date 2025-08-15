using EduRural.API.Constants;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Users;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]

    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        public UsersController(
            IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<UserDto>>>>>
            GetPaginationList(string searchTerm = "", int page = 1, int pageSize = 0)
        {
            var response = await _usersService
                .GetListAsync(searchTerm, page, pageSize);

            return StatusCode(response.StatusCode, new ResponseDto<PaginationDto
                <List<UserDto>>>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.PADRE}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<UserDto>>> GetOneById(
            string id)
        {
            var response = await _usersService.GetOneByIdAsync(id);

            return StatusCode(response.StatusCode, new ResponseDto<UserDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpGet("eligible")]
        [Authorize(Roles = $"{RolesConstant.ADMIN},{RolesConstant.PROFESOR}")]
        public async Task<ActionResult<ResponseDto<PaginationDto<List<UserDto>>>>>
    GetEligible([FromQuery] string role, [FromQuery] string searchTerm = "", [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
           

            // role esperado: "PADRE" o "PROFESOR"
            var response = await _usersService.GetEligibleAsync(role, searchTerm, page, pageSize);

            return StatusCode(response.StatusCode, new ResponseDto<PaginationDto<List<UserDto>>>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpPost]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<UserActionResponseDto>>>
            Create([FromBody] UserCreateDto dto)
        {
            var response = await _usersService.CreateAsync(dto);

            return StatusCode(response.StatusCode,
                new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = response.StatusCode,
                    Status = response.Status,
                    Message = response.Message,
                    Data = response.Data
                });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<UserActionResponseDto>>> Edit(
            [FromBody] UserEditDto dto, string id)
        {
            var response = await _usersService.EditAsync(dto, id);

            return StatusCode(response.StatusCode,
                new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = response.StatusCode,
                    Status = response.Status,
                    Message = response.Message,
                    Data = response.Data
                });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{RolesConstant.PROFESOR}, {RolesConstant.ADMIN}")]
        public async Task<ActionResult<ResponseDto<UserActionResponseDto>>>
            Delete(string id)
        {
            var response = await _usersService.DeleteAsync(id);

            return StatusCode(response.StatusCode, new ResponseDto<UserActionResponseDto>
            {
                StatusCode = response.StatusCode,
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }
    }
}
