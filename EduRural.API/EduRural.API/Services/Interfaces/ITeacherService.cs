using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Teachers;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services.Interfaces
{
    public interface ITeacherService
    {
        Task<ResponseDto<PaginationDto<List<TeacherDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0);
    }
}
