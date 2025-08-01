using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Teachers;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface ITeacherService
    {
        Task<ResponseDto<TeacherActionResponseDto>> CreateAsync(TeacherCreateDto dto);
        Task<ResponseDto<TeacherActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<TeacherActionResponseDto>> EditAsync(TeacherEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<TeacherDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<TeacherDto>> GetOneByIdAsync(string id);
    }
}
