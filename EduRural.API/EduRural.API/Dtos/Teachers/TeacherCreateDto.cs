namespace EduRural.API.Dtos.Teachers
{
    public class TeacherCreateDto
    {
        public string UserId { get; set; }       // Relación con el usuario
        public string PhoneNumber { get; set; }
        public string Specialty { get; set; }

        // asignar materias al crear
        public List<string> SubjectIds { get; set; }
    }

}
