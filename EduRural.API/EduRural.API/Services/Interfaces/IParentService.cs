using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Parents;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IParentService
    {
        Task<ResponseDto<PaginationDto<List<ParentDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<ParentDto>> GetOneByIdAsync(string id);
        Task<ResponseDto<ParentActionResponseDto>> CreateAsync(ParentCreateDto dto);
        Task<ResponseDto<ParentActionResponseDto>> EditAsync(ParentEditDto dto, string id);
        Task<ResponseDto<ParentActionResponseDto>> DeleteAsync(string id);

    }
}
