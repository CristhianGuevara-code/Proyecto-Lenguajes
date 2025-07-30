using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Subjects;
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
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public GradesService(EduRuralDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<GradeDto>>>> GetListAsync(
              string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<GradeEntity> gradeQuery = _context.Grades;

            if (!string.IsNullOrEmpty(searchTerm)) //si el termino de busqueda es diferente a vacio o nulo
            {
                gradeQuery = gradeQuery.Where
                    (x => (x.Name).Contains(searchTerm));
            }

            int totalRows = await gradeQuery.CountAsync();

            var gradesEntity = await gradeQuery
                .OrderBy(x => x.Name)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();


            var gradesDto = _mapper.Map<List<GradeDto>>(gradesEntity);

            return new ResponseDto<PaginationDto<List<GradeDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = gradesEntity.Count() > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<GradeDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = gradesDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math
                    .Ceiling((double)(totalRows / pageSize)),

                }
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
                Message = "Materia encontrada",
                Data = _mapper.Map<GradeDto>(grade)
            };
        }

        public async Task<ResponseDto<GradeActionResponseDto>> CreateAsync(GradeCreateDto dto)
        {

            var gradeEntity = _mapper.Map<GradeEntity>(dto); // automapper

            gradeEntity.Id = Guid.NewGuid().ToString();

            _context.Grades.Add(gradeEntity); // agregar esto en memoria de nuestro proyecto

            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<GradeActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado Correctamente",
                Data = _mapper.Map<GradeActionResponseDto>(gradeEntity) //:: :: Automapper 
            };
        }

        public async Task<ResponseDto<GradeActionResponseDto>> EditAsync(GradeEditDto dto, string id)
        {
            var gradeEntity = await _context.Grades.FindAsync(id); // ver si existe el registro

            // si no existe
            if (gradeEntity is null)
            {
                return new ResponseDto<GradeActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            //Si se encuentra el registro
            _mapper.Map<GradeEditDto, GradeEntity>(dto, gradeEntity); //:: :: Automapper

            _context.Grades.Update(gradeEntity); // guardar en memoria
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<GradeActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<GradeActionResponseDto>(gradeEntity)  // :: :: Automapper
            };

        }

        public async Task<ResponseDto<GradeActionResponseDto>> DeleteAsync(string id)
        {
            var gradeEntity = await _context.Grades.FindAsync(id); // ver si existe el registro

            if (gradeEntity is null)
            {
                return new ResponseDto<GradeActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var gradetInGuide = await _context.Guides.CountAsync(p => p.GradeId == id); // ver si la materia existe en una guia

            if (gradetInGuide > 0)
            {
                return new ResponseDto<GradeActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "El grado tiene datos relaionados"
                };
            }

            _context.Grades.Remove(gradeEntity); // borrar el registro
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<GradeActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<GradeActionResponseDto>(gradeEntity)
            };
        }
    }
}
