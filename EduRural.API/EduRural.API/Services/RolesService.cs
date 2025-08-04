using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Roles;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services
{
    public class RolesService : IRolesService
    {
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly EduRuralDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly int PAGE_SIZE;
        private readonly int PAGE_SIZE_LIMIT;

        public RolesService(
            RoleManager<RoleEntity> roleManager,
            EduRuralDbContext context,
            IConfiguration configuration,
            IMapper mapper
        )
        {
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            PAGE_SIZE = _configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = _configuration.GetValue<int>("PageSizeLimit");

        }
        public async Task<ResponseDto<PaginationDto<List<RoleDto>>>> GetListAsync(
            string searchTerm = "", int page = 1, int pageSize = 10
        )
        {
            pageSize = pageSize == 0 ? PAGE_SIZE : pageSize;

            int startIndex = (page - 1) * pageSize;

            IQueryable<RoleEntity> rolesQuery = _context.Roles;

            if (!string.IsNullOrEmpty(searchTerm))
            {
                rolesQuery = rolesQuery
                    .Where(r => (r.Name + " " + r.Description)
                    .Contains(searchTerm));
            }

            int totalRows = await rolesQuery.CountAsync();

            var roles = await rolesQuery
                .OrderBy(r => r.Name)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            var rolesDto = _mapper.Map<List<RoleDto>>(roles);

            return new ResponseDto<PaginationDto<List<RoleDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registros obtenidos correctamente",
                Data = new PaginationDto<List<RoleDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = rolesDto,
                    HasNextPage = startIndex + pageSize > PAGE_SIZE_LIMIT &&
                    page < (int)Math.Ceiling((double)totalRows / pageSize),
                    HasPreviousPage = page > 1
                }
            };
        }

        public async Task<ResponseDto<RoleDto>> GetOneById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role is null)
            {
                return new ResponseDto<RoleDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            return new ResponseDto<RoleDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro encontrado correctamente",
                Data = _mapper.Map<RoleDto>(role)
            };

        }

        public async Task<ResponseDto<RoleActionResponseDto>> CreateAsync(RoleCreateDto dto)
        {
            var role = _mapper.Map<RoleEntity>(dto);

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                return new ResponseDto<RoleActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description)),
                };
            }

            return new ResponseDto<RoleActionResponseDto>
            {
                StatusCode = HttpStatusCode.CREATED,
                Status = true,
                Message = "Registro creado correctamente",
                Data = _mapper.Map<RoleActionResponseDto>(role)
            };
        }

        public async Task<ResponseDto<RoleActionResponseDto>> EditAsync(RoleEditDto dto, string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            if (role is null)
            {
                return new ResponseDto<RoleActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            _mapper.Map<RoleEditDto, RoleEntity>(dto, role);

            var result = await _roleManager.UpdateAsync(role);

            if (!result.Succeeded)
            {
                return new ResponseDto<RoleActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            return new ResponseDto<RoleActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro editado correctamente",
                Data = _mapper.Map<RoleActionResponseDto>(role)
            };

        }

        public async Task<ResponseDto<RoleActionResponseDto>> DeleteAsync(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            if (role is null)
            {
                return new ResponseDto<RoleActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var result = await _roleManager.DeleteAsync(role);

            if (!result.Succeeded)
            {
                return new ResponseDto<RoleActionResponseDto>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            return new ResponseDto<RoleActionResponseDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro Borrado correctamente",
                Data = _mapper.Map<RoleActionResponseDto>(role)
            };

        }
    }
}
