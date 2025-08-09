using System.ComponentModel.DataAnnotations;

namespace EduRural.API.Dtos.Auth
{
    public class RefreshTokenDto
    {
        [Required(ErrorMessage = "El token es requerido")]
        public string Token { get; set; }

        [Required(ErrorMessage = "El RefreshToken es requerido")]
        public string RefreshToken { get; set; }
    }
}
