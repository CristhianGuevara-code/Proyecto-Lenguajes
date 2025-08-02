using AutoMapper;
using EduRural.API.Database.Entities;
using EduRural.API.Database;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Grades;
using EduRural.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persons.API.Dtos.Common;
using EduRural.API.Dtos.Parents;
using Persons.API.Constants;

namespace EduRural.API.Services
{
    public class ParentService : IParentService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public ParentService(EduRuralDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<ParentDto>>>> GetListAsync(
              string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<ParentEntity> parentQuery = _context.Parents;

            if (!string.IsNullOrEmpty(searchTerm)) //si el termino de busqueda es diferente a vacio o nulo
            {
                parentQuery = parentQuery.Where
                    (x => (x.UserId).Contains(searchTerm));
            }

            int totalRows = await parentQuery.CountAsync();

            var parentsEntity = await parentQuery
                .OrderBy(x => x.UserId)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();


            var parentsDto = _mapper.Map<List<ParentDto>>(parentsEntity);

            return new ResponseDto<PaginationDto<List<ParentDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = parentsEntity.Count() > 0 ? "Registros encontrados" : "No se encontraron registros",
                Data = new PaginationDto<List<ParentDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = parentsDto,
                    HasPreviousPage = page > 1,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT && page < (int)Math
                    .Ceiling((double)(totalRows / pageSize)),

                }
            };
        }

        public async Task<ResponseDto<ParentDto>> GetOneByIdAsync(string id)
        {
            var parent = await _context.Parents.FirstOrDefaultAsync(p => p.Id == id);

            if (parent is null)
            {
                return new ResponseDto<ParentDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Grado no encontrado"
                };
            }

            return new ResponseDto<ParentDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Grado encontrado",
                Data = _mapper.Map<ParentDto>(parent)
            };
        }

        public async Task<ResponseDto<ParentActionResponseDto>> CreateAsync(ParentCreateDto dto)
        {

            var parentEntity = _mapper.Map<ParentEntity>(dto); // automapper

            parentEntity.Id = Guid.NewGuid().ToString();

            _context.Parents.Add(parentEntity); // agregar esto en memoria de nuestro proyecto

            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<ParentActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado Correctamente",
                Data = _mapper.Map<ParentActionResponseDto>(parentEntity) //:: :: Automapper 
            };
        }

        public async Task<ResponseDto<ParentActionResponseDto>> EditAsync(ParentEditDto dto, string id)
        {
            var parentEntity = await _context.Parents.FindAsync(id); // ver si existe el registro

            // si no existe
            if (parentEntity is null)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            //Si se encuentra el registro
            _mapper.Map<ParentEditDto, ParentEntity>(dto, parentEntity); //:: :: Automapper

            _context.Parents.Update(parentEntity); // guardar en memoria
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<ParentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<ParentActionResponseDto>(parentEntity)  // :: :: Automapper
            };

        }

        public async Task<ResponseDto<ParentActionResponseDto>> DeleteAsync(string id)
        {
            var parentEntity = await _context.Parents.FindAsync(id); // ver si existe el registro

            if (parentEntity is null)
            {
                return new ResponseDto<ParentActionResponseDto>
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

            _context.Parents.Remove(parentEntity); // borrar el registro
            await _context.SaveChangesAsync(); // guardar los cambios

            return new ResponseDto<ParentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<ParentActionResponseDto>(parentEntity)
            };
        }
    }
}
