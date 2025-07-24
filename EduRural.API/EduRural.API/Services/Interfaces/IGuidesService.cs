using EduRural.API.Dtos.Guides;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IGuidesService
    {
        Task<ResponseDto<GuideDto>> CreateAsync(GuideCreateDto dto, string userId);
        Task<ResponseDto<GuideDto>> DeleteAsync(string id);
        Task<ResponseDto<GuideDto>> EditAsync(GuideEditDto dto, string id);
        Task<ResponseDto<List<GuideDto>>> GetListAsync();
        Task<ResponseDto<GuideDto>> GetOneByIdAsync(string id);
    }
}
