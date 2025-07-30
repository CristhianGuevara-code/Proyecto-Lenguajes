using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Subjects;
using EduRural.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persons.API.Constants;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public SubjectService(EduRuralDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<SubjectDto>>>> GetListAsync(
            string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<SubjectEntity> subjectQuery = _context.Subjects;

            if (!string.IsNullOrEmpty(searchTerm)) //si el termino de busqueda es diferente a vacio o nulo
            {
                subjectQuery = subjectQuery.Where
                    (x => (x.Name).Contains(searchTerm));
            }

            int totalRows = await subjectQuery.CountAsync();

            var subjectsEntity = await subjectQuery
                .OrderBy(x => x.Name)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();


            var subjectsDto = _mapper.Map<List<SubjectDto>>(subjectsEntity);

            return new ResponseDto<PaginationDto<List<SubjectDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = subjectsEntity.Count() > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<SubjectDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = subjectsDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math
                    .Ceiling((double)(totalRows / pageSize)),

                }
            };
        }

        //public async Task<ResponseDto<List<SubjectDto>>> GetListAsync()
        //{
        //    var subjects = await _context.Subjects.ToListAsync();

        //    return new ResponseDto<List<SubjectDto>>
        //    {
        //        StatusCode = HttpStatusCode.OK,
        //        Status = true,
        //        Message = "Materias obtenidas correctamente",
        //        Data = _mapper.Map<List<SubjectDto>>(subjects)
        //    };
        //}

        public async Task<ResponseDto<SubjectDto>> GetOneByIdAsync(string id)
        {
            var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == id);

            if (subject is null)
            {
                return new ResponseDto<SubjectDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Materia no encontrada"
                };
            }

            return new ResponseDto<SubjectDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Materia encontrada",
                Data = _mapper.Map<SubjectDto>(subject)
            };
        }

        public async Task<ResponseDto<SubjectActionResponseDto>> CreateAsync(SubjectCrateDto dto)
        {

            var subjectEntity = _mapper.Map<SubjectEntity>(dto); // automapper

            subjectEntity.Id = Guid.NewGuid().ToString();

            _context.Subjects.Add(subjectEntity); // agregar esto en memoria de nuestro proyecto

            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<SubjectActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado Correctamente",
                Data = _mapper.Map<SubjectActionResponseDto>(subjectEntity) //:: :: Automapper 
            };
        }

        public async Task<ResponseDto<SubjectActionResponseDto>> EditAsync(SubjectEditDto dto, string id)
        {
            var subjectEntity = await _context.Subjects.FindAsync(id); // ver si existe el registro

            // si no existe
            if (subjectEntity is null)
            {
                return new ResponseDto<SubjectActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            //Si se encuentra el registro
            _mapper.Map<SubjectEditDto, SubjectEntity>(dto, subjectEntity); //:: :: Automapper

            _context.Subjects.Update(subjectEntity); // guardar en memoria
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<SubjectActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<SubjectActionResponseDto>(subjectEntity)  // :: :: Automapper
            };

        }

        //public async Task<ResponseDto<SubjectDto>> EditAsync(SubjectEditDto dto, string id)
        //{
        //    var subject = await _context.Subjects.FindAsync(id);

        //    if (subject is null)
        //    {
        //        return new ResponseDto<SubjectDto>
        //        {
        //            StatusCode = HttpStatusCode.NOT_FOUND,
        //            Status = false,
        //            Message = "Materia no encontrada"
        //        };
        //    }

        //    _mapper.Map(dto, subject);
        //    _context.Subjects.Update(subject);
        //    await _context.SaveChangesAsync();

        //    return new ResponseDto<SubjectDto>
        //    {
        //        StatusCode = HttpStatusCode.OK,
        //        Status = true,
        //        Message = "Materia actualizada correctamente",
        //        Data = _mapper.Map<SubjectDto>(subject)
        //    };
        //}

        public async Task<ResponseDto<SubjectActionResponseDto>> DeleteAsync(string id)
        {
            var subjectEntity = await _context.Subjects.FindAsync(id); // ver si existe el registro

            if (subjectEntity is null)
            {
                return new ResponseDto<SubjectActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var subjectInGuide = await _context.Guides.CountAsync(p => p.SubjectId == id); // ver si la materia existe en una guia

            if (subjectInGuide > 0)
            {
                return new ResponseDto<SubjectActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "La materia tiene datos relaionados"
                };
            }

            _context.Subjects.Remove(subjectEntity); // borrar el registro
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<SubjectActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<SubjectActionResponseDto>(subjectEntity)
            };
        }

        //public async Task<ResponseDto<SubjectDto>> DeleteAsync(string id)
        //{
        //    var subject = await _context.Subjects.FindAsync(id);

        //    if (subject is null)
        //    {
        //        return new ResponseDto<SubjectDto>
        //        {
        //            StatusCode = HttpStatusCode.NOT_FOUND,
        //            Status = false,
        //            Message = "Materia no encontrada"
        //        };
        //    }

        //    var guidesInSubject = await _context.Guides.CountAsync(g => g.SubjectId == id);
        //    if (guidesInSubject > 0)
        //    {
        //        return new ResponseDto<SubjectDto>
        //        {
        //            StatusCode = HttpStatusCode.BAD_REQUEST,
        //            Status = false,
        //            Message = "No se puede eliminar: la materia tiene guías asociadas"
        //        };
        //    }

        //    _context.Subjects.Remove(subject);
        //    await _context.SaveChangesAsync();

        //    return new ResponseDto<SubjectDto>
        //    {
        //        StatusCode = HttpStatusCode.OK,
        //        Status = true,
        //        Message = "Materia eliminada correctamente",
        //        Data = _mapper.Map<SubjectDto>(subject)
        //    };
        //}
    }
}
