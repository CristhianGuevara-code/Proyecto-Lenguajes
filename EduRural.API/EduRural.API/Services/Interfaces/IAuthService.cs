using EduRural.API.Dtos.Auth;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginDto dto);
    }
}
