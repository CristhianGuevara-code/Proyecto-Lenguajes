using EduRural.API.Database.Entities.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_grades")]
    public class GradeEntity : BaseEntity
    {
        //[Key]
        //public string Id { get; set; }

        [Column("name")]
        [StringLength(50)]
        public string Name { get; set; }

        public ICollection<GuideEntity> Guides { get; set; }

        [Column("teacher_id")]
        public string TeacherId { get; set; }
        public TeacherEntity Teacher { get; set; }

    }
}
