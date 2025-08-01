using EduRural.API.Dtos.Subjects;

namespace EduRural.API.Dtos.Students
{
    public class StudentDto
    {
        public string Id { get; set; }        // Id del estudiante
        public string FullName { get; set; }
        public DateTime BirthDate { get; set; }

        // Información del grado
        public string GradeId { get; set; }
        public string GradeName { get; set; }

        // Si querés devolver las materias
        public List<SubjectDto> Subjects { get; set; }
    }

}
