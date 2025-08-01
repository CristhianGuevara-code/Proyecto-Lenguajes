using EduRural.API.Database.Entities.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_students")]
    public class StudentEntity : BaseEntity
    {
        [Column("full_name")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Column("birth_date")]
        public DateTime BirthDate { get; set; }

        // Relación con Grade
        [Column("grade_id")]
        public string GradeId { get; set; }
        public GradeEntity Grade { get; set; }

        // Relación con Parent
        [Column("parent_id")]
        public string ParentId { get; set; }
        public ParentEntity Parent { get; set; }

        // Relación con Subjects (si cada estudiante puede estar en varias materias)
        public ICollection<StudentSubjectEntity> StudentSubjects { get; set; }
    }
}
