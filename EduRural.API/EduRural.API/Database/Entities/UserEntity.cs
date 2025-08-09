using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("sec_users")]
    public class UserEntity : IdentityUser
    {
        [Column("full_name")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Column("avatar_url")]
        [StringLength(256)]
        public string AvatarUrl { get; set; }

        [Column("birth_date")]
        public DateTime BirthDate { get; set; }

        [Column("refresh_token")]
        public string RefreshToken { get; set; }

        [Column("refresh_token_expiry")]
        public DateTime RefreshTokenExpiry { get; set; }

        public ICollection<GuideEntity> Guides { get; set; }

        public TeacherEntity Teacher { get; set; }
        public ParentEntity Parent { get; set; }

    }
}
