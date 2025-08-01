using EduRural.API.Database.Entities.Common;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EduRural.API.Database.Entities
{
    [Table("edu_parents")]
    public class ParentEntity : BaseEntity
    {
        [Column("phone_number")]
        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [Column("address")]
        [StringLength(200)]
        public string Address { get; set; }

        // Relación 1:1 con Users
        [ForeignKey("User")]
        public string UserId { get; set; }
        public UserEntity User { get; set; }

        // Relación 1:N con Students
        public ICollection<StudentEntity> Students { get; set; }
    }
}
