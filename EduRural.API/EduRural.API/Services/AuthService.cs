using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Auth;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persons.API.Constants;
using Persons.API.Dtos.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EduRural.API.Services
{
   
        public class AuthService : IAuthService
        {
            private readonly SignInManager<UserEntity> _signInManager;
            private readonly UserManager<UserEntity> _userManager;
            private readonly IConfiguration _configuration;
            private readonly EduRuralDbContext _context;

            public AuthService(
                SignInManager<UserEntity> signInManager,
                UserManager<UserEntity> userManager,
                IConfiguration configuration,
                EduRuralDbContext context)
            {
                _signInManager = signInManager;
                _userManager = userManager;
                _configuration = configuration;
                _context = context;
            }

            public async Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginDto dto)
            {
                var result = await _signInManager.PasswordSignInAsync(
                    dto.Email,
                    dto.Password,
                    isPersistent: false,
                    lockoutOnFailure: false
                );

                if (!result.Succeeded)
                {
                    return new ResponseDto<LoginResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = $"Fallo el inicio de sesión"
                    };
                }

                var userEntity = await _context.Users
                    .Where(u => u.Email == dto.Email).FirstOrDefaultAsync();

                // ClaimList Creation
                var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, dto.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("UserId", userEntity.Id),
            };

                // Add roles to the claim list
                var userRoles = await _userManager.GetRolesAsync(userEntity);

                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }

                var jwtToken = GetToken(authClaims);

                return new ResponseDto<LoginResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Autenticación satisfactoria",
                    Data = new LoginResponseDto
                    {
                        Email = userEntity.Email,
                        Token = new JwtSecurityTokenHandler()
                            .WriteToken(jwtToken)
                    }
                };
            }

            private JwtSecurityToken GetToken(List<Claim> authClaims)
            {
                var authSigninKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])
                );

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now
                        .AddMinutes(int.Parse(_configuration["JWT:Expires"])),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
                );

                return token;
            }
        }

}
