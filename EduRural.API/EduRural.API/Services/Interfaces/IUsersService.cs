using EduRural.API.Dtos.Users;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IUsersService
    {
        Task<ResponseDto<UserActionResponseDto>> CreateAsync(UserCreateDto dto);
        Task<ResponseDto<UserActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<UserActionResponseDto>> EditAsync(UserEditDto dto, string id);
        Task<ResponseDto<UserDto>> GetOneByIdAsync(string id);
    }
}
