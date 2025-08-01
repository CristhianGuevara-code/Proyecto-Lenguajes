using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_students_subjects")]
    public class StudentSubjectEntity
    {
        [Key]
        public string Id { get; set; }

        [Column("student_id")]
        public string StudentId { get; set; }
        public StudentEntity Student { get; set; }

        [Column("subject_id")]
        public string SubjectId { get; set; }
        public SubjectEntity Subject { get; set; }
    }
}
