using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IGradesService
    {
        Task<ResponseDto<GradeActionResponseDto>> CreateAsync(GradeCreateDto dto);
        Task<ResponseDto<GradeActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<GradeActionResponseDto>> EditAsync(GradeEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<GradeDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<GradeDto>> GetOneByIdAsync(string id);
    }
}
