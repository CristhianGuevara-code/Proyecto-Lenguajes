using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_teachers_subjects")]
    public class TeacherSubjectEntity
    {
        [Key]
        public string Id { get; set; }

        [Column("teacher_id")]
        public string TeacherId { get; set; }
        public TeacherEntity Teacher { get; set; }

        [Column("subject_id")]
        public string SubjectId { get; set; }
        public SubjectEntity Subject { get; set; }
    }
}
