using System.ComponentModel.DataAnnotations;

namespace EduRural.API.Dtos.Grades
{
    public class GradeCreateDto
    {
        [Display(Name = "Nombre")]
        [Required(ErrorMessage = "El  {0} es requerido")]
        [StringLength(50, ErrorMessage = "Los {0} no pueden tener más de {1} caracteres")]
        public string Name { get; set; }
    }
}
