using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Teachers;
using EduRural.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public TeacherService(EduRuralDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<TeacherDto>>>> GetListAsync(
             string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<TeacherEntity> teacherQuery = _context.Teachers;

            if (!string.IsNullOrEmpty(searchTerm)) //si el termino de busqueda es diferente a vacio o nulo
            {
                teacherQuery = teacherQuery.Where
                    (x => (x.Specialty).Contains(searchTerm));
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
                Message = teachersEntity.Count() > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<TeacherDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = teachersDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math
                    .Ceiling((double)(totalRows / pageSize)),

                }
            };
        }

        public async Task<ResponseDto<TeacherDto>> GetOneByIdAsync(string id)
        {
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.Id == id);

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

            var teacherEntity = _mapper.Map<TeacherEntity>(dto); // automapper

            teacherEntity.Id = Guid.NewGuid().ToString();

            _context.Teachers.Add(teacherEntity); // agregar esto en memoria de nuestro proyecto

            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<TeacherActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado Correctamente",
                Data = _mapper.Map<TeacherActionResponseDto>(teacherEntity) //:: :: Automapper 
            };
        }

        public async Task<ResponseDto<TeacherActionResponseDto>> EditAsync(TeacherEditDto dto, string id)
        {
            var teacherEntity = await _context.Teachers.FindAsync(id); // ver si existe el registro

            // si no existe
            if (teacherEntity is null)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            //Si se encuentra el registro
            _mapper.Map<TeacherEditDto, TeacherEntity>(dto, teacherEntity); //:: :: Automapper

            _context.Teachers.Update(teacherEntity); // guardar en memoria
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<TeacherActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<TeacherActionResponseDto>(teacherEntity)  // :: :: Automapper
            };

        }

        public async Task<ResponseDto<TeacherActionResponseDto>> DeleteAsync(string id)
        {
            var teacherEntity = await _context.Teachers.FindAsync(id); // ver si existe el registro

            if (teacherEntity is null)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var teacherInGuide = await _context.Guides.CountAsync(p => p.TeacherId == id); // ver si la materia existe en una guia

            if (teacherInGuide > 0)
            {
                return new ResponseDto<TeacherActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "El grado tiene datos relaionados"
                };
            }

            _context.Teachers.Remove(teacherEntity); // borrar el registro
            await _context.SaveChangesAsync(); // guardar los cambios

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
