using EduRural.API.Dtos.Grades;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IGradesService
    {
        Task<ResponseDto<GradeDto>> CreateAsync(GradeCreateDto dto);
        Task<ResponseDto<GradeDto>> DeleteAsync(string id);
        Task<ResponseDto<GradeDto>> EditAsync(GradeEditDto dto, string id);
        Task<ResponseDto<List<GradeDto>>> GetListAsync();
        Task<ResponseDto<GradeDto>> GetOneByIdAsync(string id);
    }
}
