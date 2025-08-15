using System.ComponentModel.DataAnnotations;

namespace EduRural.API.Dtos.Users
{
    public class UserEditDto
    {
        [Display(Name = "Nombre Completo")]
        [Required(ErrorMessage = "El {0} es requerido")]
        [StringLength(100, ErrorMessage = "El {0} no puede tener más de {1} caracteres")]
        public string FullName { get; set; }

        [Display(Name = "Correo Electrónico")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [EmailAddress(ErrorMessage = "El {0} no tiene un formato de correo válido")]
        [StringLength(256, ErrorMessage = "El {0} no puede tener más de {1} caracteres")]
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public List<string> Roles { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
