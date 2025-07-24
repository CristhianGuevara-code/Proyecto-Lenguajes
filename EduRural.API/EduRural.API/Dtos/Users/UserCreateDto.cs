using System.ComponentModel.DataAnnotations;

namespace EduRural.API.Dtos.Users
{
    public class UserCreateDto
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

        //[StringLength(50)]
        //public string AvatarUrl { get; set; }

        [Display(Name = "Fecha de Nacimiento")]
        public DateTime BirthDate { get; set; }

        [Display(Name = "Roles")]
        public List<string> Roles { get; set; }

        [Display(Name = "Contraseña")]
        [Required(ErrorMessage = "La {0} es requerida")]
        [StringLength(100, ErrorMessage = "La {0} no puede tener más de {1} caracteres")]
        public string Password { get; set; }

        [Display(Name = "Confirmar Contraseña")]
        [Compare(nameof(Password), ErrorMessage = "Las contraseñas no son iguales")]
        public string ConfirmPassword { get; set; }
    }
}
