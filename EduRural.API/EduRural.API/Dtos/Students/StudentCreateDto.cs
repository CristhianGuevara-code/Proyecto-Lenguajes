namespace EduRural.API.Dtos.Students
{
    public class StudentCreateDto
    {
        public string FullName { get; set; }
        public DateTime BirthDate { get; set; }
        public string GradeId { get; set; }

        // Lista de materias asociadas al estudiante
        public List<string> SubjectIds { get; set; }
    }

}
