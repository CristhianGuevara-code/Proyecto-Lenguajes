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
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public StudentService(EduRuralDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<StudentDto>>>> GetListAsync(
              string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<StudentEntity> studentQuery = _context.Students;

            if (!string.IsNullOrEmpty(searchTerm)) //si el termino de busqueda es diferente a vacio o nulo
            {
                studentQuery = studentQuery.Where
                    (x => (x.FullName).Contains(searchTerm));
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
                Message = studentsEntity.Count() > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<StudentDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = studentsDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math
                    .Ceiling((double)(totalRows / pageSize)),

                }
            };
        }

        public async Task<ResponseDto<StudentDto>> GetOneByIdAsync(string id)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id);

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
                Message = "Grado encontrado",
                Data = _mapper.Map<StudentDto>(student)
            };
        }

        public async Task<ResponseDto<StudentActionResponseDto>> CreateAsync(StudentCreateDto dto)
        {

            var studentEntity = _mapper.Map<StudentEntity>(dto); // automapper

            studentEntity.Id = Guid.NewGuid().ToString();

            _context.Students.Add(studentEntity); // agregar esto en memoria de nuestro proyecto

            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<StudentActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado Correctamente",
                Data = _mapper.Map<StudentActionResponseDto>(studentEntity) //:: :: Automapper 
            };
        }

        public async Task<ResponseDto<StudentActionResponseDto>> EditAsync(StudentEditDto dto, string id)
        {
            var studentEntity = await _context.Students.FindAsync(id); // ver si existe el registro

            // si no existe
            if (studentEntity is null)
            {
                return new ResponseDto<StudentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            //Si se encuentra el registro
            _mapper.Map<StudentEditDto, StudentEntity>(dto, studentEntity); //:: :: Automapper

            _context.Students.Update(studentEntity); // guardar en memoria
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<StudentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<StudentActionResponseDto>(studentEntity)  // :: :: Automapper
            };

        }

        public async Task<ResponseDto<StudentActionResponseDto>> DeleteAsync(string id)
        {
            var studentEntity = await _context.Students.FindAsync(id); // ver si existe el registro

            if (studentEntity is null)
            {
                return new ResponseDto<StudentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            //var gradetInGuide = await _context.Guides.CountAsync(p => p.GradeId == id); // ver si la materia existe en una guia

            //if (gradetInGuide > 0)
            //{
            //    return new ResponseDto<GradeActionResponseDto>
            //    {
            //        StatusCode = HttpStatusCode.BAD_REQUEST,
            //        Status = false,
            //        Message = "El grado tiene datos relaionados"
            //    };
            //}

            _context.Students.Remove(studentEntity); // borrar el registro
            await _context.SaveChangesAsync(); // guardar los cambios

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
