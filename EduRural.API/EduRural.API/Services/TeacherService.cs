using AutoMapper;
using EduRural.API.Constants;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Teachers;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;


namespace EduRural.API.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<UserEntity> _userManager;
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public TeacherService(EduRuralDbContext context, IMapper mapper,
            UserManager<UserEntity> userManager, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<TeacherDto>>>> GetListAsync(
             string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize;

            IQueryable<TeacherEntity> teacherQuery = _context.Teachers
               .Include(t => t.User)
               .Include(t => t.TeacherSubjects)
                    .ThenInclude(ts => ts.Subject);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                teacherQuery = teacherQuery.Where(x => x.Specialty.Contains(searchTerm));
            }

            int totalRows = await teacherQuery.CountAsync();

            var teachersEntity = await teacherQuery
                .OrderBy(x => x.Specialty)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            var teachersDto = _mapper.Map<List<TeacherDto>>(teachersEntity);

            return new ResponseDto<PaginationDto<List<TeacherDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = teachersEntity.Count > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<TeacherDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = teachersDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math.Ceiling((double)(totalRows / pageSize)),
                }
            };
        }

        public async Task<ResponseDto<TeacherDto>> GetOneByIdAsync(string id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.User)
                .Include(t => t.TeacherSubjects)
                    .ThenInclude(ts => ts.Subject)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher is null)
            {
                return new ResponseDto<TeacherDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Maestro no encontrado"
                };
            }

            return new ResponseDto<TeacherDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Maestro encontrado",
                Data = _mapper.Map<TeacherDto>(teacher)
            };
        }

        public async Task<ResponseDto<TeacherActionResponseDto>> CreateAsync(TeacherCreateDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);

            if (user == null)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "El usuario no existe"
                };
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Contains(RolesConstant.PROFESOR))
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "El usuario no tiene el rol de maestro"
                };
            }

            var existingTeacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == dto.UserId);

            if (existingTeacher != null)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.CONFLICT,
                    Status = false,
                    Message = "Ya existe un maestro asociado a ese usuario"
                };
            }

            var teacherEntity = _mapper.Map<TeacherEntity>(dto);
            teacherEntity.Id = Guid.NewGuid().ToString();

            var subjects = await _context.Subjects
                .Where(s => dto.SubjectIds.Contains(s.Id))
                .ToListAsync();

            teacherEntity.TeacherSubjects = subjects.Select(s => new TeacherSubjectEntity
            {
                Id = Guid.NewGuid().ToString(),
                SubjectId = s.Id,
                TeacherId = teacherEntity.Id
            }).ToList();

            _context.Teachers.Add(teacherEntity);
            await _context.SaveChangesAsync();

            var teacherWithIncludes = await _context.Teachers
                .Include(t => t.User)
                .Include(t => t.TeacherSubjects)
                    .ThenInclude(ts => ts.Subject)
                .FirstOrDefaultAsync(t => t.Id == teacherEntity.Id);

            return new ResponseDto<TeacherActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado correctamente",
                Data = _mapper.Map<TeacherActionResponseDto>(teacherWithIncludes)
            };
        }

        public async Task<ResponseDto<TeacherActionResponseDto>> EditAsync(TeacherEditDto dto, string id)
        {
            var teacherEntity = await _context.Teachers
                .Include(t => t.TeacherSubjects)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacherEntity is null)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            _mapper.Map(dto, teacherEntity);

            var subjects = await _context.Subjects
                .Where(s => dto.SubjectIds.Contains(s.Id))
                .ToListAsync();

            // Eliminar relaciones actuales
            _context.TeacherSubject.RemoveRange(teacherEntity.TeacherSubjects);

            // Crear nuevas relaciones
            teacherEntity.TeacherSubjects = subjects.Select(s => new TeacherSubjectEntity
            {
                Id = Guid.NewGuid().ToString(),
                SubjectId = s.Id,
                TeacherId = teacherEntity.Id
            }).ToList();

            _context.Teachers.Update(teacherEntity);
            await _context.SaveChangesAsync();

            var teacherWithIncludes = await _context.Teachers
                .Include(t => t.User)
                .Include(t => t.TeacherSubjects)
                    .ThenInclude(ts => ts.Subject)
                .FirstOrDefaultAsync(t => t.Id == teacherEntity.Id);

            return new ResponseDto<TeacherActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<TeacherActionResponseDto>(teacherWithIncludes)
            };
        }

        public async Task<ResponseDto<TeacherActionResponseDto>> DeleteAsync(string id)
        {
            var teacherEntity = await _context.Teachers
                .Include(t => t.User)
                .Include(t => t.TeacherSubjects)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacherEntity is null)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var teacherInGuide = await _context.Guides.CountAsync(p => p.TeacherId == id);

            if (teacherInGuide > 0)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "El grado tiene datos relacionados"
                };
            }

            _context.Teachers.Remove(teacherEntity);
            await _context.SaveChangesAsync();

            return new ResponseDto<TeacherActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<TeacherActionResponseDto>(teacherEntity)
            };
        }
    }
}
