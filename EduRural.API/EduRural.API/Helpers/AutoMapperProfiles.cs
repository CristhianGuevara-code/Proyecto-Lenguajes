using AutoMapper;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Guides;
using EduRural.API.Dtos.Roles;
using EduRural.API.Dtos.Users;


namespace EduRural.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Guide
            CreateMap<GuideCreateDto, GuideEntity>();
            CreateMap<GuideEditDto, GuideEntity>();

            CreateMap<GuideEntity, GuideDto>()
                .ForMember(dest => dest.GradeName, opt => opt.MapFrom(src => src.Grade.Name))
                .ForMember(dest => dest.UploadedByName, opt => opt.MapFrom(src => src.UploadedBy.FullName));

            // Grade
            CreateMap<GradeEntity, GradeDto>();
            CreateMap<GradeCreateDto, GradeEntity>()
    .ForMember(dest => dest.Id, opt => opt.Ignore());


            // Role 
            CreateMap<RoleEntity, RoleDto>();
            CreateMap<RoleEntity, RoleActionResponseDto>();
            CreateMap<RoleCreateDto, RoleEntity>();
            CreateMap<RoleEditDto, RoleEntity>();

            // User
            CreateMap<UserEntity, UserDto>()
                .ForMember(dest => dest.Roles, opt => opt.Ignore()); 

            CreateMap<UserCreateDto, UserEntity>();
        }
    }
}
