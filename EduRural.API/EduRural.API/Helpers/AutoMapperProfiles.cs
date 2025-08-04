using AutoMapper;
using EduRural.API.Database.Entities;
using EduRural.API.Dtos.Grades;
using EduRural.API.Dtos.Guides;
using EduRural.API.Dtos.Parents;
using EduRural.API.Dtos.Roles;
using EduRural.API.Dtos.Students;
using EduRural.API.Dtos.Subjects;
using EduRural.API.Dtos.Teachers;
using EduRural.API.Dtos.Users;


namespace EduRural.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Guide
            CreateMap<GuideEntity, GuideDto>()
               .ForMember(dest => dest.GradeName, opt => opt.MapFrom(src => src.Grade.Name))
               .ForMember(dest => dest.UploadedByName, opt => opt.MapFrom(src => src.UploadedBy.FullName));
            CreateMap<GuideEntity, GuideActionResponseDto>();
            CreateMap<GuideCreateDto, GuideEntity>();
            CreateMap<GuideEditDto, GuideEntity>();

           

            // Grade
            CreateMap<GradeEntity, GradeDto>();
            CreateMap<GradeEntity, GradeActionResponseDto>();
            CreateMap<GradeCreateDto, GradeEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<GradeEditDto, GradeEntity>();

            // Subject
            CreateMap<SubjectEntity, SubjectDto>();
            CreateMap<SubjectEntity, SubjectActionResponseDto>();
            CreateMap<SubjectCrateDto, SubjectEntity>();
            CreateMap<SubjectEditDto, SubjectEntity>();

            // Role 
            CreateMap<RoleEntity, RoleDto>();
            CreateMap<RoleEntity, RoleActionResponseDto>();
            CreateMap<RoleCreateDto, RoleEntity>();
            CreateMap<RoleEditDto, RoleEntity>();

            // User
            CreateMap<UserEntity, UserDto>();
            CreateMap<UserEntity, UserActionResponseDto>();
            CreateMap<UserCreateDto, UserEntity>()
                .ForMember(dest => dest.UserName, org => org.MapFrom(src => src.Email));
            CreateMap<UserEditDto, UserEntity>();

            // Parent 
            CreateMap<ParentEntity, ParentDto>();
            CreateMap<ParentEntity, ParentActionResponseDto>();
            CreateMap<ParentCreateDto, ParentEntity>();
            CreateMap<ParentEditDto, ParentEntity>();

            // Student 
            CreateMap<StudentEntity, StudentDto>()
            .ForMember(dest => dest.SubjectsIds, opt => opt
            .MapFrom(src => src.StudentSubjects.Select(ss => ss.SubjectId).ToList()));
            CreateMap<StudentEntity, StudentActionResponseDto>();
            
            CreateMap<StudentCreateDto, StudentEntity>();
            CreateMap<StudentEditDto, StudentEntity>();

            // Teacher 
            CreateMap<TeacherEntity, TeacherDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src => src.TeacherSubjects.Select(ts => ts.Subject)));
            CreateMap<TeacherEntity, TeacherActionResponseDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src => src.TeacherSubjects.Select(ts => ts.Subject)));

            CreateMap<TeacherCreateDto, TeacherEntity>();
            CreateMap<TeacherEditDto, TeacherEntity>();
        }
    }
}
