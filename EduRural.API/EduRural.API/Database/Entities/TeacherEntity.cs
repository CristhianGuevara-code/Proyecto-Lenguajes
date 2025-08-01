using EduRural.API.Database.Entities.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_teachers")]
    public class TeacherEntity : BaseEntity
    {
        [Column("user_id")]
        public string UserId { get; set; }
        public UserEntity User { get; set; }

        [Column("phone_number")]
        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [Column("specialty")]
        [StringLength(100)]
        public string Specialty { get; set; }

        // Relación con los grados que imparte
        public ICollection<GradeEntity> Grades { get; set; }

        // Relación con las guías que ha subido
        public ICollection<GuideEntity> Guides { get; set; }
    }
}
