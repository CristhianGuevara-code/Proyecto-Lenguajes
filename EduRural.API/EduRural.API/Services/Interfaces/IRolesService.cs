using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Roles;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IRolesService
    {
        Task<ResponseDto<RoleActionResponseDto>> CreateAsync(RoleCreateDto dto);
        Task<ResponseDto<RoleActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<RoleActionResponseDto>> EditAsync(RoleEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<RoleDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 10);
        Task<ResponseDto<RoleDto>> GetOneById(string id);
    }
}
