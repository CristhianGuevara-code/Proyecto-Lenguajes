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
using System.Security.Cryptography;
using System.Text;

namespace Persons.API.Services
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
                    Message = $"Falló el inicio de sesión"
                };
            }

            var userEntity = await _context.Users
                .Where(u => u.Email == dto.Email).FirstOrDefaultAsync();

            // ClaimList Creation
            List<Claim> authClaims = await GetClaims(userEntity);

            var refreshToken = this.GenerateRefreshTokenString();

            userEntity.RefreshToken = refreshToken;
            userEntity.RefreshTokenExpiry = DateTime.Now.AddMinutes(int.Parse(_configuration["JWT:RefreshTokenExpiry"]));

            await _context.SaveChangesAsync();


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
                        .WriteToken(jwtToken),
                    RefreshToken = refreshToken
                }
            };
        }

        public async Task<ResponseDto<LoginResponseDto>> RefreshTokenAsync(RefreshTokenDto dto)
        {
            string email = "";

            try
            {
                var principal = GetTokenPrincipal(dto.Token);

                var emailClaim = principal.Claims.FirstOrDefault(
                        c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                    );
                if (emailClaim is null)
                {
                    return new ResponseDto<LoginResponseDto>
                    {
                        StatusCode = HttpStatusCode.UNAUTHORIZED,
                        Status = false,
                        Message = "Acceso no autorizado: No se encontró el claim de correo electrónico en el token"
                    };
                }

                email = emailClaim.Value;

                var userEntity = await _userManager.FindByEmailAsync(email);

                if (userEntity is null)
                {
                    return new ResponseDto<LoginResponseDto>
                    {
                        StatusCode = HttpStatusCode.UNAUTHORIZED,
                        Status = false,
                        Message = "Acceso no autorizado: El usuario no existe"
                    };
                }

                // TODO: Evaluar si el usuario está activo o inactivo
                //       Evaluar si el usuario tiene un bloqueo

                // RefreshToken:
                if (userEntity.RefreshToken != dto.RefreshToken)
                {
                    return new ResponseDto<LoginResponseDto>
                    {
                        StatusCode = HttpStatusCode.UNAUTHORIZED,
                        Status = false,
                        Message = "Acceso no autoizado: la sesión no es valida"
                    };
                }

                if (userEntity.RefreshTokenExpiry < DateTime.Now)
                {
                    return new ResponseDto<LoginResponseDto>
                    {
                        StatusCode = HttpStatusCode.UNAUTHORIZED,
                        Status = false,
                        Message = "Acceso no autorizado: La sesión ha expirado"
                    };
                }

                List<Claim> authClaims = await GetClaims(userEntity);

                var jwtToken = GetToken(authClaims);

                var refreshToken = this.GenerateRefreshTokenString();

                userEntity.RefreshToken = refreshToken;
                userEntity.RefreshTokenExpiry = DateTime.Now.AddMinutes(int.Parse(_configuration["JWT:RefreshTokenExpiry"]));

                await _context.SaveChangesAsync();

                return new ResponseDto<LoginResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Token renovado satisfactoriamente",
                    Data = new LoginResponseDto
                    {
                        Email = userEntity.Email,
                        Token = new JwtSecurityTokenHandler()
                       .WriteToken(jwtToken),
                        RefreshToken = refreshToken
                    }
                };
            }
            catch
            {
                return new ResponseDto<LoginResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Ocurrió un error al renovar la sesión, por favor intente de nuevo"
                };
            }
        }

        private async Task<List<Claim>> GetClaims(UserEntity userEntity)
        {

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userEntity.Id),
                new Claim(ClaimTypes.Email, userEntity.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("UserId", userEntity.Id),
            };

            // Add roles to the claim list
            var userRoles = await _userManager.GetRolesAsync(userEntity);

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            return authClaims;
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

        private string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[64];
            using (var numberGenerator = RandomNumberGenerator.Create())
            {
                numberGenerator.GetBytes(randomNumber);
            }

            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal GetTokenPrincipal(string token)
        {
            var segurityKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_configuration.GetSection("JWT:Secret").Value));

            var validation = new TokenValidationParameters
            {
                IssuerSigningKey = segurityKey,
                ValidateLifetime = false,
                ValidateActor = false,
                ValidateIssuer = false,
                ValidateAudience = false,
            };

            return new JwtSecurityTokenHandler()
                .ValidateToken(token, validation, out _);
        }
    }
}