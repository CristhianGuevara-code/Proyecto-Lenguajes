using EduRural.API.Dtos.Users;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        //[HttpGet]
        //public async Task<ActionResult<ResponseDto<List<UserDto>>>> GetAll()
        //{
        //    var response = await _usersService.GetListAsync(); 
        //    return StatusCode((int)response.StatusCode, new ResponseDto<List<UserDto>>
        //    {
        //        Status = response.Status,
        //        Message = response.Message,
        //        Data = response.Data
        //    });
        //}

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<UserDto>>> GetOneById(string id)
        {
            var response = await _usersService.GetOneByIdAsync(id);

            return StatusCode((int)response.StatusCode, new ResponseDto<UserDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<UserActionResponseDto>>> Create([FromBody] UserCreateDto dto)
        {
            var response = await _usersService.CreateAsync(dto);

            return StatusCode((int)response.StatusCode, new ResponseDto<UserActionResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseDto<UserActionResponseDto>>> Edit([FromBody] UserEditDto dto, string id)
        {
            var response = await _usersService.EditAsync(dto, id);

            return StatusCode((int)response.StatusCode, new ResponseDto<UserActionResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseDto<UserActionResponseDto>>> Delete(string id)
        {
            var response = await _usersService.DeleteAsync(id);

            return StatusCode((int)response.StatusCode, new ResponseDto<UserActionResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }
    }
}
