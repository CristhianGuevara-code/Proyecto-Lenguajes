using AutoMapper;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Roles;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Persons.API.Constants;
using Persons.API.Dtos.Common;

namespace EduRural.API.Services
{
    public class RolesService : IRolesService
    {
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly IMapper _mapper;

        public RolesService(RoleManager<RoleEntity> roleManager, IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<ResponseDto<RoleDto>> GetOneByIdAsync(string id)
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
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
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

            _mapper.Map(dto, role);
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
                Message = "Registro borrado correctamente",
                Data = _mapper.Map<RoleActionResponseDto>(role)
            };
        }
    }
}
