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
using EduRural.API.Constants;
using Microsoft.AspNetCore.Identity;
using EduRural.API.Dtos.Users;

namespace EduRural.API.Services
{
    public class ParentService : IParentService
    {
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<UserEntity> _userManager;
        private readonly int PAGE_ZISE;         //readonly es para que esa variable no cambie cuando se inicialice
        private readonly int PAGE_SIZE_LIMIT;  //readonly es para que esa variable no cambie cuando se inicialice

        public ParentService(EduRuralDbContext context, IMapper mapper,
            UserManager<UserEntity> userManager, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            PAGE_ZISE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<ParentDto>>>> GetListAsync(
              string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_ZISE : pageSize;
            int startIndex = (page - 1) * pageSize; // nos sirve para definir el indice inicial de la paginacion

            IQueryable<ParentEntity> parentQuery = _context.Parents
            .Include(p => p.User)
            .Include(p => p.Students);

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
            var parent = await _context.Parents
                .Include(p => p.User)
                .Include(p => p.Students)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent is null)
            {
                return new ResponseDto<ParentDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Padre no encontrado"
                };
            }

            return new ResponseDto<ParentDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Padre encontrado",
                Data = _mapper.Map<ParentDto>(parent)
            };
        }

        public async Task<ResponseDto<ParentActionResponseDto>> CreateAsync(ParentCreateDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);

            if (user == null)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "El usuario no existe"
                };
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (!roles.Contains(RolesConstant.PADRE))
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "El usuario no tiene el rol de padre"
                };
            }

            // Validar que el alumno exista
            var studentsCount = await _context.Students
    .CountAsync(s => dto.StudentIds.Contains(s.Id));

            if (studentsCount != dto.StudentIds.Count)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Algunos alumnos relacionados no existen"
                };
            }

            var existingParent = await _context.Parents
                .FirstOrDefaultAsync(p => p.UserId == dto.UserId);

            if (existingParent != null)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.CONFLICT,
                    Status = false,
                    Message = "Ya existe un padre asociado a ese usuario"
                };
            }

           

            // Obtener los estudiantes por sus IDs
            var students = await _context.Students
                .Where(s => dto.StudentIds.Contains(s.Id))
                .ToListAsync();

            // Verificar si alguno ya tiene padre asignado
            var alreadyAssigned = students.Where(s => !string.IsNullOrEmpty(s.ParentId)).ToList();

            if (alreadyAssigned.Any())
            {
                var nombres = string.Join(", ", alreadyAssigned.Select(s => s.FullName));

                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = $"Los siguientes estudiantes ya están asociados a un padre: {nombres}"
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

            var parentEntity = _mapper.Map<ParentEntity>(dto);
            parentEntity.Id = Guid.NewGuid().ToString();

            parentEntity.Students = students;

            _context.Parents.Add(parentEntity);
            await _context.SaveChangesAsync();

            var parentWithDetails = await _context.Parents
            .Include(p => p.User)
            .Include(p => p.Students)
            .FirstOrDefaultAsync(p => p.Id == parentEntity.Id);


             // Confirmar transacción
             await transaction.CommitAsync();

                return new ResponseDto<ParentActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado correctamente",
                Data = _mapper.Map<ParentActionResponseDto>(parentWithDetails)
            };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }


        public async Task<ResponseDto<ParentActionResponseDto>> EditAsync(ParentEditDto dto, string id)
        {
            var parentEntity = await _context.Parents
                .Include(p => p.Students)
                .FirstOrDefaultAsync(p => p.Id == id); 

            if (parentEntity is null)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            // Validar si existen los estudiantes enviados
            var students = await _context.Students
                .Where(s => dto.StudentIds.Contains(s.Id))
                .ToListAsync();

            if (students.Count != dto.StudentIds.Count)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "Uno o más estudiantes no existen"
                };
            }

            // Validar si ya están asignados a otro padre
            var alreadyAssigned = await _context.Students
                .Where(s => dto.StudentIds.Contains(s.Id) && s.ParentId != null && s.ParentId != parentEntity.Id)
                .ToListAsync();

            if (alreadyAssigned.Any())
            {
                var nombres = string.Join(", ", alreadyAssigned.Select(s => s.FullName));

                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = $"Los siguientes estudiantes ya están asociados a otro padre: {nombres}"
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                // Mapear propiedades del padre
                _mapper.Map(dto, parentEntity);

            // Actualizar la relación con estudiantes
            parentEntity.Students = students;

            _context.Parents.Update(parentEntity);
            await _context.SaveChangesAsync();

            var parentWithDetails = await _context.Parents
            .Include(p => p.User)
            .Include(p => p.Students)
            .FirstOrDefaultAsync(p => p.Id == parentEntity.Id);
            
            // Confirmar transacción
             await transaction.CommitAsync();

            return new ResponseDto<ParentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro modificado correctamente",
                Data = _mapper.Map<ParentActionResponseDto>(parentEntity)
            };

        }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }


        public async Task<ResponseDto<ParentActionResponseDto>> DeleteAsync(string id)
        {
            var parentEntity = await _context.Parents
                .Include(p => p.User) 
                .Include(p => p.Students)
                .FirstOrDefaultAsync(p => p.Id == id); // ver si existe el registro


            if (parentEntity is null)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var hasStudent = await _context.Students.AnyAsync(s => s.ParentId == id);

            if (hasStudent)
            {
                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "No se puede eliminar el padre porque tiene estudiantes asociados"
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                _context.Parents.Remove(parentEntity); // borrar el registro
            await _context.SaveChangesAsync(); // guardar los cambios

                // Confirmar transacción
                await transaction.CommitAsync();

                return new ResponseDto<ParentActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<ParentActionResponseDto>(parentEntity)
            };
        }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<ParentActionResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
}
        }
    }
}
