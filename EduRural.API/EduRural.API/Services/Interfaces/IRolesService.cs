using EduRural.API.Dtos.Roles;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IRolesService
    {
        Task<ResponseDto<RoleActionResponseDto>> CreateAsync(RoleCreateDto dto);
        Task<ResponseDto<RoleActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<RoleActionResponseDto>> EditAsync(RoleEditDto dto, string id);
        Task<ResponseDto<RoleDto>> GetOneByIdAsync(string id);
    }
}
