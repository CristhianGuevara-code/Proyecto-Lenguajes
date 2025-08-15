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
               .ForMember(dest => dest.UploadedByName, opt => opt.MapFrom(src => src.UploadedBy.FullName))
               .ForMember(d => d.GradeId, opt => opt.MapFrom(s => s.GradeId))
               .ForMember(d => d.SubjectId, opt => opt.MapFrom(s => s.SubjectId))
               .ForMember(d => d.SubjectName, o => o.MapFrom(s => s.Subject.Name));
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
            CreateMap<UserEditDto, UserEntity>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Parent 
            CreateMap<ParentEntity, ParentDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
            .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));

            CreateMap<ParentEntity, ParentActionResponseDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
            .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));
            CreateMap<ParentCreateDto, ParentEntity>();
            CreateMap<ParentEditDto, ParentEntity>();

            // Student 
            CreateMap<StudentEntity, StudentDto>()
            .ForMember(dest => dest.SubjectsIds, opt => opt.MapFrom(src =>
            (src.StudentSubjects ?? new List<StudentSubjectEntity>())
            .Select(ss => ss.SubjectId))) // Mapea los IDs de las asignaturas
            .ForMember(dest => dest.SubjectsNames, opt => opt.MapFrom(src =>
            string.Join(", ", (src.StudentSubjects ?? new List<StudentSubjectEntity>())
            .Select(ss => ss.Subject.Name)))) // Convierte a string concatenado
            .ForMember(dest => dest.GradeName, opt => opt.MapFrom(src => src.Grade.Name))
            .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.Parent.Id))  // Mapea el ParentId
            .ForMember(dest => dest.ParentName, opt => opt.MapFrom(src => src.Parent.User.FullName)); // Mapea el nombre del padre

            CreateMap<StudentEntity, StudentActionResponseDto>()
                .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src =>
                    (src.StudentSubjects ?? new List<StudentSubjectEntity>())
                        .Select(ss => ss.Subject))) // Mapea las asignaturas completas
                .ForMember(dest => dest.GradeName, opt => opt.MapFrom(src => src.Grade.Name));

            CreateMap<StudentCreateDto, StudentEntity>()
                .ForMember(dest => dest.StudentSubjects, opt => opt.Ignore());

            CreateMap<StudentEditDto, StudentEntity>()
                .ForMember(dest => dest.StudentSubjects, opt => opt.Ignore());



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
