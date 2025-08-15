using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Common;
using EduRural.API.Dtos.Users;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persons.API.Constants;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services
{
    public class UsersService : IUsersService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly IMapper _mapper;
        private readonly EduRuralDbContext _context;
        private readonly int PAGE_SIZE;
        private readonly int PAGE_SIZE_LIMIT;

        public UsersService(
            UserManager<UserEntity> userManager,
            RoleManager<RoleEntity> roleManager,
            IMapper mapper,
            EduRuralDbContext context,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _context = context;
            PAGE_SIZE = configuration.GetValue<int>("PageSize");
            PAGE_SIZE_LIMIT = configuration.GetValue<int>("PageSizeLimit");
        }

        public async Task<ResponseDto<PaginationDto<List<UserDto>>>> GetListAsync
            (string searchTerm = "", int page = 1, int pageSize = 0)
        {
            pageSize = pageSize == 0 ? PAGE_SIZE : pageSize;

            int startIndex = (page - 1) * pageSize;

            IQueryable<UserEntity> usersQuery = _context.Users;

            if (!string.IsNullOrEmpty(searchTerm))
            {
                usersQuery = usersQuery
                    .Where(x => (x.FullName + " " + x.UserName)
                    .Contains(searchTerm));
            }

            int totalRows = await usersQuery.CountAsync();

            var usersEntity = await usersQuery
                .OrderBy(x => x.FullName)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            var usersDto = _mapper.Map<List<UserDto>>(usersEntity);
            for (int i = 0; i < usersEntity.Count; i++)
            {
                var roles = await _userManager.GetRolesAsync(usersEntity[i]);
                usersDto[i].Roles = roles.ToList();
            }

            return new ResponseDto<PaginationDto<List<UserDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registros obtenidos correctamente",
                Data = new PaginationDto<List<UserDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = usersDto,
                    HasNextPage = startIndex + pageSize < PAGE_SIZE_LIMIT
                    && page < (int)Math.Ceiling((double)totalRows / pageSize),
                    HasPreviousPage = page > 1
                }
            };
        }

        public async Task<ResponseDto<UserDto>> GetOneByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null)
            {
                return new ResponseDto<UserDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            var userDto = _mapper.Map<UserDto>(user);

            // Obtener los roles del usuario desde el UserManager
            var roles = await _userManager.GetRolesAsync(user);
            userDto.Roles = roles.ToList(); // Asegúrate que UserDto tenga una propiedad List<string> Roles

            return new ResponseDto<UserDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro encontrado",
                Data = userDto
            };
        }

        // Endpoint para traer los usuarios que no tienen roles de admin
        public async Task<ResponseDto<PaginationDto<List<UserDto>>>> GetEligibleAsync(
     string role, string searchTerm = "", int page = 1, int pageSize = 0)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return new ResponseDto<PaginationDto<List<UserDto>>>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "Debe especificar el rol (PADRE o PROFESOR)."
                };
            }

            role = role.Trim().ToUpperInvariant();

            pageSize = pageSize == 0 ? PAGE_SIZE : Math.Min(pageSize, PAGE_SIZE_LIMIT);
            int startIndex = (page - 1) * pageSize;

            // IDs de usuarios con rol ADMIN (siempre excluidos)
            var adminUserIds = await (
                from ur in _context.Set<IdentityUserRole<string>>()
                join r in _context.Roles on ur.RoleId equals r.Id
                where r.Name == EduRural.API.Constants.RolesConstant.ADMIN
                select ur.UserId
            ).ToListAsync();

            // Query base
            IQueryable<UserEntity> usersQuery = _context.Users.AsQueryable();

            if (role == EduRural.API.Constants.RolesConstant.PADRE)
            {
                // Deben tener rol PADRE y no estar vinculados como Parent
                var padreUserIdsQuery =
                    from ur in _context.Set<IdentityUserRole<string>>()
                    join r in _context.Roles on ur.RoleId equals r.Id
                    where r.Name == EduRural.API.Constants.RolesConstant.PADRE
                    select ur.UserId;

                usersQuery = usersQuery
                    .Include(u => u.Parent)
                    .Where(u => u.Parent == null)                     // no vinculado aún
                    .Where(u => padreUserIdsQuery.Contains(u.Id));    // con rol PADRE
            }
            else if (role == EduRural.API.Constants.RolesConstant.PROFESOR)
            {
                // Deben tener rol PROFESOR y no estar vinculados como Teacher
                var profUserIdsQuery =
                    from ur in _context.Set<IdentityUserRole<string>>()
                    join r in _context.Roles on ur.RoleId equals r.Id
                    where r.Name == EduRural.API.Constants.RolesConstant.PROFESOR
                    select ur.UserId;

                usersQuery = usersQuery
                    .Include(u => u.Teacher)
                    .Where(u => u.Teacher == null)                    // no vinculado aún
                    .Where(u => profUserIdsQuery.Contains(u.Id));     // con rol PROFESOR
            }
            else
            {
                return new ResponseDto<PaginationDto<List<UserDto>>>
                {
                    StatusCode = HttpStatusCode.BAD_REQUEST,
                    Status = false,
                    Message = "Rol inválido. Use PADRE o PROFESOR."
                };
            }

            // Excluir ADMIN siempre
            usersQuery = usersQuery.Where(u => !adminUserIds.Contains(u.Id));

            // Búsqueda por nombre/correo/username
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                usersQuery = usersQuery.Where(u =>
                    (u.FullName + " " + u.Email + " " + u.UserName).Contains(searchTerm));
            }

            // Total y página
            int totalRows = await usersQuery.CountAsync();

            var usersEntity = await usersQuery
                .OrderBy(u => u.FullName)
                .Skip(startIndex)
                .Take(pageSize)
                .ToListAsync();

            // Mapear DTO + roles (para mostrar en el combo)
            var usersDto = _mapper.Map<List<UserDto>>(usersEntity);
            for (int i = 0; i < usersEntity.Count; i++)
            {
                var roles = await _userManager.GetRolesAsync(usersEntity[i]);
                usersDto[i].Roles = roles.ToList();
            }

            return new ResponseDto<PaginationDto<List<UserDto>>>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registros elegibles obtenidos correctamente",
                Data = new PaginationDto<List<UserDto>>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalItems = totalRows,
                    TotalPages = (int)Math.Ceiling((double)totalRows / pageSize),
                    Items = usersDto,
                    HasNextPage = (startIndex + pageSize) < totalRows,
                    HasPreviousPage = page > 1
                }
            };
        }



        public async Task<ResponseDto<UserActionResponseDto>> CreateAsync(UserCreateDto dto)
        {
            if (dto.Roles != null && dto.Roles.Any())
            {
                var existingRoles = await _roleManager
                    .Roles.Select(r => r.Name).ToListAsync();

                var invalidRoles = dto.Roles.Except(existingRoles);

                if (invalidRoles.Any())
                {
                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = $"Roles son inválidos: {string.Join(", ", invalidRoles)}"
                    };
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = _mapper.Map<UserEntity>(dto);

                var createResult = await _userManager.CreateAsync(user, dto.Password);

                if (!createResult.Succeeded)
                {
                    await transaction.RollbackAsync();

                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = string.Join(", ", createResult
                            .Errors.Select(e => e.Description))
                    };
                }

                // Asiganar roles al usuario
                if (dto.Roles != null && dto.Roles.Any())
                {
                    var addRolesRusult = await _userManager
                        .AddToRolesAsync(user, dto.Roles);

                    if (!addRolesRusult.Succeeded)
                    {
                        await transaction.RollbackAsync();

                        return new ResponseDto<UserActionResponseDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = string.Join(", ", addRolesRusult
                                .Errors.Select(e => e.Description))
                        };
                    }
                }

                // Confirmar transacción
                await transaction.CommitAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Registro creado correctamente",
                    Data = _mapper.Map<UserActionResponseDto>(user)
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }

    

        public async Task<ResponseDto<UserActionResponseDto>> EditAsync(UserEditDto dto, string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user is null)
            {
                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            // Validar roles si vienen
            if (dto.Roles != null && dto.Roles.Any())
            {
                var existingRoles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
                var invalidRoles = dto.Roles.Except(existingRoles);
                if (invalidRoles.Any())
                {
                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = $"Roles son inválidos: {string.Join(", ", invalidRoles)}"
                    };
                }
            }

            // Validar que el Email no exista
            if (!string.IsNullOrWhiteSpace(dto.Email) && !dto.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase))
            {
                var emailExists = await _userManager.FindByEmailAsync(dto.Email);
                if (emailExists != null && emailExists.Id != user.Id)
                {
                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.CONFLICT,
                        Status = false,
                        Message = "El correo ya está en uso."
                    };
                }
                // Normalizar
                user.Email = dto.Email.Trim().ToLowerInvariant();
                user.UserName = user.Email;
                user.NormalizedEmail = _userManager.NormalizeEmail(user.Email);
                user.NormalizedUserName = _userManager.NormalizeName(user.UserName);
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Mapear solo campos editables no nulos
                _mapper.Map(dto, user);

                // Cambiar contraseña SOLO si viene
                if (!string.IsNullOrWhiteSpace(dto.Password) || !string.IsNullOrWhiteSpace(dto.ConfirmPassword))
                {
                    if (string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.ConfirmPassword))
                    {
                        await transaction.RollbackAsync();
                        return new ResponseDto<UserActionResponseDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = "Debe proporcionar contraseña y confirmación."
                        };
                    }

                    if (dto.Password != dto.ConfirmPassword)
                    {
                        await transaction.RollbackAsync();
                        return new ResponseDto<UserActionResponseDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = "Las contraseñas no coinciden."
                        };
                    }

                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var reset = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                    if (!reset.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        return new ResponseDto<UserActionResponseDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = $"Error al cambiar contraseña: {string.Join(", ", reset.Errors.Select(e => e.Description))}"
                        };
                    }
                }

                // Actualizar usuario
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = string.Join(", ", updateResult.Errors.Select(e => e.Description))
                    };
                }

                // Sincronizar roles si mandan la lista completa
                if (dto.Roles is not null)
                {
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    var rolesToAdd = dto.Roles.Except(currentRoles).ToList();
                    var rolesToRemove = currentRoles.Except(dto.Roles).ToList();

                    if (rolesToAdd.Any())
                    {
                        var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
                        if (!addResult.Succeeded)
                        {
                            await transaction.RollbackAsync();
                            return new ResponseDto<UserActionResponseDto>
                            {
                                StatusCode = HttpStatusCode.BAD_REQUEST,
                                Status = false,
                                Message = $"Error al agregar roles: {string.Join(", ", addResult.Errors.Select(e => e.Description))}"
                            };
                        }
                    }

                    if (rolesToRemove.Any())
                    {
                        var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                        if (!removeResult.Succeeded)
                        {
                            await transaction.RollbackAsync();
                            return new ResponseDto<UserActionResponseDto>
                            {
                                StatusCode = HttpStatusCode.BAD_REQUEST,
                                Status = false,
                                Message = $"Error al borrar roles: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}"
                            };
                        }
                    }
                }

                await transaction.CommitAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Registro editado correctamente",
                    Data = _mapper.Map<UserActionResponseDto>(user)
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }
        }

        public async Task<ResponseDto<UserActionResponseDto>> DeleteAsync(
            string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.NOT_FOUND,
                    Status = false,
                    Message = "Registro no encontrado"
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var userResponse = _mapper.Map<UserActionResponseDto>(user);

                var currentRoles = await _userManager.GetRolesAsync(user); //traer lo roles que pueda llegar a tener ese usuario

                if (currentRoles.Any())
                {
                    var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

                    if (!removeRolesResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        return new ResponseDto<UserActionResponseDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = $"Error al remover roles: {string.Join(", ", removeRolesResult
                            .Errors.Select(e => e.Description))}"
                        };
                    }
                }

                var deleteUserResult = await _userManager.DeleteAsync(user);
                if (!deleteUserResult.Succeeded)
                {
                    await transaction.RollbackAsync();

                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = string.Join(", ", deleteUserResult.Errors.Select(e => e.Description))
                    };
                }

                await transaction.CommitAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Registro eliminado correctamente",
                    Data = userResponse
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
                    Status = false,
                    Message = "Error interno en el servidor"
                };
            }

        }
    }
}
