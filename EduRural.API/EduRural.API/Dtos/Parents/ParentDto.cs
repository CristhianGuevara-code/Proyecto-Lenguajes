using EduRural.API.Dtos.Students;

namespace EduRural.API.Dtos.Parents
{
    public class ParentDto
    {
        public string Id { get; set; }          // Id del padre (mismo UserId)
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        // devolver info del usuario relacionado
        public string FullName { get; set; }
        public string Email { get; set; }

        // devolver los hijos asociados
        public List<StudentDto> Students { get; set; }
    }

}
