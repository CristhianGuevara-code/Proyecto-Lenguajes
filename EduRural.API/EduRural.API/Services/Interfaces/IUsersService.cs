using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Users;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IUsersService
    {
        Task<ResponseDto<UserActionResponseDto>> CreateAsync(UserCreateDto dto);
        Task<ResponseDto<UserActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<UserActionResponseDto>> EditAsync(UserEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<UserDto>>>> GetEligibleAsync(string role, string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<PaginationDto<List<UserDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<UserDto>> GetOneByIdAsync(string id);
    }
}
