using EduRural.API.Database.Entities.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_subjects")]
    public class SubjectEntity : BaseEntity
    {
        //[Key]
        //public string Id { get; set; } = Guid.NewGuid().ToString();

        [Column("name")]
        [StringLength(50)]
        public string Name { get; set; }

        public ICollection<GuideEntity> Guides { get; set; }
    }
}
