using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_grades")]
    public class GradeEntity
    {
        [Key]
        public string Id { get; set; }

        [Column("name")]
        [StringLength(50)]
        public string Name { get; set; }

        public ICollection<GuideEntity> Guides { get; set; }
    }
}
