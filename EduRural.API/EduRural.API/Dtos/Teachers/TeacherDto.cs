using EduRural.API.Dtos.Subjects;

namespace EduRural.API.Dtos.Teachers
{
    public class TeacherDto
    {
        public string Id { get; set; }           // Id del Teacher
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Specialty { get; set; }

        // devolver las materias que imparte
        public List<SubjectDto> Subjects { get; set; }
    }

}
