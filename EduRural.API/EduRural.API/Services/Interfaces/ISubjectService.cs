using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Subjects;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<ResponseDto<SubjectActionResponseDto>> CreateAsync(SubjectCrateDto dto);
        Task<ResponseDto<SubjectActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<SubjectActionResponseDto>> EditAsync(SubjectEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<SubjectDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<SubjectDto>> GetOneByIdAsync(string id);
    }
}
