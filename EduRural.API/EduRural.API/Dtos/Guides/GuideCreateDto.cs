using System.ComponentModel.DataAnnotations;

namespace EduRural.API.Dtos.Guides
{
    public class GuideCreateDto
    {
        [Display(Name = "Title")]
        [Required(ErrorMessage = "El  {0} es requerido")]
        [StringLength(50, ErrorMessage = "Los {0} no pueden tener más de {1} caracteres")]
        public string Title { get; set; }

        [Display(Name = "Description")]
        [StringLength(500, ErrorMessage = "Los {0} no pueden tener más de {1} caracteres")]
        public string Description { get; set; }

        [Display(Name = "GradeId")]
        [Required(ErrorMessage = "El  {0} es requerido")]
        public string GradeId { get; set; }

        [Display(Name = "SubjectId")]
        [Required(ErrorMessage = "El  {0} es requerido")]
        public string SubjectId { get; set; }

        // Archivo subido
        [Required(ErrorMessage = "El  {0} es requerido")]
        public IFormFile File { get; set; }
    }
}
