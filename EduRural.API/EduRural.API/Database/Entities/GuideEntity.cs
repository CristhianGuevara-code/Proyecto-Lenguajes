using EduRural.API.Database.Entities.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduRural.API.Database.Entities
{
    [Table("edu_guides")]
    public class GuideEntity : BaseEntity
    {
        //[Key]
        //public string Id { get; set; }

        [Column("title")]
        [StringLength(100)]
        public string Title { get; set; }

        [Column("description")]
        [StringLength(500)]
        public string Description { get; set; }

        [Column("file_path")]
        public string FilePath { get; set; }

        [Column("upload_date")]
        public DateTime UploadDate { get; set; }

        [Column("grade_id")]
        public string GradeId { get; set; }
        public GradeEntity Grade { get; set; }

        [Column("uploaded_by_id")]
        public string UploadedById { get; set; }
        public UserEntity UploadedBy { get; set; }

        [Column("subject_id")]
        public string SubjectId { get; set; }
        public SubjectEntity Subject { get; set; }

    }
}
