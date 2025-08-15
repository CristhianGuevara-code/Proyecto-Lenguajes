using EduRural.API.Dtos.Subjects;

namespace EduRural.API.Dtos.Students
{
    public class StudentActionResponseDto
    {
        public string Id { get; set; }        // Id del estudiante
        public string FullName { get; set; }
        public DateTime BirthDate { get; set; }

        // Información del grado
        public string GradeId { get; set; }
        public string GradeName { get; set; }

        // Información del padre
        public string ParentId { get; set; }
        public string ParentName { get; set; }

        public List<SubjectDto> Subjects { get; set; }
        public string SubjectsNames { get; set; }
    }
}
