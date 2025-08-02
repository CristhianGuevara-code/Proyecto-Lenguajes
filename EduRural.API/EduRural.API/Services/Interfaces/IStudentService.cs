using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Students;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface IStudentService
    {
        Task<ResponseDto<StudentActionResponseDto>> CreateAsync(StudentCreateDto dto);
        Task<ResponseDto<StudentActionResponseDto>> DeleteAsync(string id);
        Task<ResponseDto<StudentActionResponseDto>> EditAsync(StudentEditDto dto, string id);
        Task<ResponseDto<PaginationDto<List<StudentDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
        Task<ResponseDto<StudentDto>> GetOneByIdAsync(string id);
    }
}
