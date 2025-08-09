using EduRural.API.Dtos.Auth;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persons.API.Dtos.Common;

namespace EduRural.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(
            IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<ResponseDto<LoginResponseDto>>> Login(LoginDto dto)
        {
            var response = await _authService.LoginAsync(dto);

            return StatusCode(response.StatusCode, new ResponseDto<LoginResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data

            });
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<ActionResult<ResponseDto<LoginResponseDto>>> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var response = await _authService.RefreshTokenAsync(dto);

            return StatusCode(response.StatusCode, new ResponseDto<LoginResponseDto>
            {
                Status = response.Status,
                Message = response.Message,
                Data = response.Data
            });
        }
    }
}
