using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Guides;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IGuidesService
    {
        Task<ResponseDto<GuideDto>> CreateAsync(GuideCreateDto dto);
        Task<ResponseDto<GuideDto>> DeleteAsync(string id);
        Task<ResponseDto<GuideDto>> EditAsync(GuideEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<GuideDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<GuideDto>> GetOneByIdAsync(string id);
    }
}
