using AutoMapper;
using EduRural.API.Database;
using EduRural.API.Database.Entities;
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
        private readonly EduRuralDbContext _context;
        private readonly IMapper _mapper;

        public UsersService(
            UserManager<UserEntity> userManager,
            RoleManager<RoleEntity> roleManager,
            EduRuralDbContext context,
            IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _mapper = mapper;
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

            return new ResponseDto<UserDto>
            {
                StatusCode = HttpStatusCode.OK,
                Status = true,
                Message = "Registro encontrado",
                Data = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<ResponseDto<UserActionResponseDto>> CreateAsync(UserCreateDto dto)
        {
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
                        Message = $"Roles inválidos: {string.Join(", ", invalidRoles)}"
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
                        Message = string.Join(", ", createResult.Errors.Select(e => e.Description))
                    };
                }

                if (dto.Roles != null && dto.Roles.Any())
                {
                    var addRolesResult = await _userManager.AddToRolesAsync(user, dto.Roles);

                    if (!addRolesResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        return new ResponseDto<UserActionResponseDto>
                        {
                            StatusCode = HttpStatusCode.BAD_REQUEST,
                            Status = false,
                            Message = string.Join(", ", addRolesResult.Errors.Select(e => e.Description))
                        };
                    }
                }

                await transaction.CommitAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.CREATED,
                    Status = true,
                    Message = "Usuario creado correctamente",
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
                        Message = $"Roles inválidos: {string.Join(", ", invalidRoles)}"
                    };
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _mapper.Map(dto, user);
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
                                Message = $"Error al remover roles: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}"
                            };
                        }
                    }
                }

                await transaction.CommitAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Usuario editado correctamente",
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

        public async Task<ResponseDto<UserActionResponseDto>> DeleteAsync(string id)
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

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var userResponse = _mapper.Map<UserActionResponseDto>(user);
                var currentRoles = await _userManager.GetRolesAsync(user);

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
                            Message = $"Error al remover roles: {string.Join(", ", removeRolesResult.Errors.Select(e => e.Description))}"
                        };
                    }
                }

                var deleteResult = await _userManager.DeleteAsync(user);
                if (!deleteResult.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return new ResponseDto<UserActionResponseDto>
                    {
                        StatusCode = HttpStatusCode.BAD_REQUEST,
                        Status = false,
                        Message = string.Join(", ", deleteResult.Errors.Select(e => e.Description))
                    };
                }

                await transaction.CommitAsync();

                return new ResponseDto<UserActionResponseDto>
                {
                    StatusCode = HttpStatusCode.OK,
                    Status = true,
                    Message = "Usuario eliminado correctamente",
                    Data = userResponse
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
    }
}
