using AutoMapper;
using EduRural.API.Database.Entities;
using EduRural.API.Database;
using EduRural.API.Dtos.Common;
using Microsoft.EntityFrameworkCore;
using Persons.API.Dtos.Common;
using EduRural.API.Services.Interfaces;
using EduRural.API.Dtos.Students;
using Persons.API.Constants;

namespace EduRural.API.Services
{
    public class StudentService : IStudentService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly int PAGE_ZISE;
        private readonly int PAGE_SIZE_LIMIT;

        public StudentService(EduRuralDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<StudentDto>>>> GetListAsync(string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize;

            IQueryable<StudentEntity> studentQuery = _context.Students
                .Include(s => s.StudentSubjects)  // Incluir tabla intermedia
                .ThenInclude(ss => ss.Subject);   // Y las materias

            if (!string.IsNullOrEmpty(searchTerm))
            {
                studentQuery = studentQuery.Where(x => x.FullName.Contains(searchTerm));
            }

            int totalRows = await studentQuery.CountAsync();

            var studentsEntity = await studentQuery
                .OrderBy(x => x.FullName)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            var studentsDto = _mapper.Map<List<StudentDto>>(studentsEntity);

            return new ResponseDto<PaginationDto<List<StudentDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = studentsEntity.Count > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<StudentDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = studentsDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math.Ceiling((double)(totalRows / pageSize)),
                }
            };
        }

        public async Task<ResponseDto<StudentDto>> GetOneByIdAsync(string id)
        {
            var student = await _context.Students
                .Include(s => s.StudentSubjects)
                .ThenInclude(ss => ss.Subject)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student is null)
            {
                return new ResponseDto<StudentDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Alumno no encontrado"
                };
            }

            return new ResponseDto<StudentDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Alumno encontrado",
                Data = _mapper.Map<StudentDto>(student)
            };
        }

        public async Task<ResponseDto<StudentActionResponseDto>> CreateAsync(StudentCreateDto dto)
        {
            var studentEntity = _mapper.Map<StudentEntity>(dto);
            studentEntity.Id = Guid.NewGuid().ToString();

            // Asignar relaciones StudentSubjects según dto.SubjectIds (tienes que agregar SubjectIds en dto)
            if (dto.SubjectIds != null && dto.SubjectIds.Any())
            {
                studentEntity.StudentSubjects = new List<StudentSubjectEntity>();

                foreach (var subjectId in dto.SubjectIds)
                {
                    studentEntity.StudentSubjects.Add(new StudentSubjectEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        SubjectId = subjectId,
                        StudentId = studentEntity.Id
                    });
                }
            }

            _context.Students.Add(studentEntity);
            await _context.SaveChangesAsync();

            var studentWithIncludes = await _context.Students
                .Include(s => s.StudentSubjects)
                .ThenInclude(ss => ss.Subject)
                .FirstOrDefaultAsync(s => s.Id == studentEntity.Id);

            return new ResponseDto<StudentActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado correctamente",
                Data = _mapper.Map<StudentActionResponseDto>(studentWithIncludes)
            };
        }

        public async Task<ResponseDto<StudentActionResponseDto>> EditAsync(StudentEditDto dto, string id)
        {
            var studentEntity = await _context.Students
                .Include(s => s.StudentSubjects)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (studentEntity is null)
            {
                return new ResponseDto<StudentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            _mapper.Map(dto, studentEntity);

            // Actualizar StudentSubjects
            if (dto.SubjectIds != null)
            {
                // Limpiar las existentes
                studentEntity.StudentSubjects.Clear();

                // Agregar las nuevas
                foreach (var subjectId in dto.SubjectIds)
                {
                    studentEntity.StudentSubjects.Add(new StudentSubjectEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        SubjectId = subjectId,
                        StudentId = studentEntity.Id
                    });
                }
            }

            _context.Students.Update(studentEntity);
            await _context.SaveChangesAsync();

            var studentWithIncludes = await _context.Students
                .Include(s => s.StudentSubjects)
                .ThenInclude(ss => ss.Subject)
                .FirstOrDefaultAsync(s => s.Id == studentEntity.Id);

            return new ResponseDto<StudentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<StudentActionResponseDto>(studentWithIncludes)
            };
        }

        public async Task<ResponseDto<StudentActionResponseDto>> DeleteAsync(string id)
        {
            var studentEntity = await _context.Students.FindAsync(id);

            if (studentEntity is null)
            {
                return new ResponseDto<StudentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            _context.Students.Remove(studentEntity);
            await _context.SaveChangesAsync();

            return new ResponseDto<StudentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<StudentActionResponseDto>(studentEntity)
            };
        }
    }
}
