using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Grades;
using EduRural.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;


namespace EduRural.API.Services
{
    public class GradesService : IGradesService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;

        public GradesService(EduRuralDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ResponseDto<List<GradeDto>>> GetListAsync()
        {
            var grades = await _context.Grades.ToListAsync();

            return new ResponseDto<List<GradeDto>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Grados obtenidos correctamente",
                Data = _mapper.Map<List<GradeDto>>(grades)
            };
        }

        public async Task<ResponseDto<GradeDto>> GetOneByIdAsync(string id)
        {
            var grade = await _context.Grades.FirstOrDefaultAsync(g => g.Id == id);

            if (grade is null)
            {
                return new ResponseDto<GradeDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Grado no encontrado"
                };
            }

            return new ResponseDto<GradeDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Grado encontrado",
                Data = _mapper.Map<GradeDto>(grade)
            };
        }

        public async Task<ResponseDto<GradeDto>> CreateAsync(GradeCreateDto dto)
        {
            var grade = _mapper.Map<GradeEntity>(dto);
            grade.Id = Guid.NewGuid().ToString();

            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return new ResponseDto<GradeDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Grado creado correctamente",
                Data = _mapper.Map<GradeDto>(grade)
            };
        }

        public async Task<ResponseDto<GradeDto>> EditAsync(GradeEditDto dto, string id)
        {
            var grade = await _context.Grades.FindAsync(id);

            if (grade is null)
            {
                return new ResponseDto<GradeDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Grado no encontrado"
                };
            }

            _mapper.Map(dto, grade);
            _context.Grades.Update(grade);
            await _context.SaveChangesAsync();

            return new ResponseDto<GradeDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Grado actualizado correctamente",
                Data = _mapper.Map<GradeDto>(grade)
            };
        }

        public async Task<ResponseDto<GradeDto>> DeleteAsync(string id)
        {
            var grade = await _context.Grades.FindAsync(id);

            if (grade is null)
            {
                return new ResponseDto<GradeDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Grado no encontrado"
                };
            }

            var guidesInGrade = await _context.Guides.CountAsync(g => g.GradeId == id);
            if (guidesInGrade > 0)
            {
                return new ResponseDto<GradeDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "No se puede eliminar: el grado tiene guías asociadas"
                };
            }

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();

            return new ResponseDto<GradeDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Grado eliminado correctamente",
                Data = _mapper.Map<GradeDto>(grade)
            };
        }
    }
}
