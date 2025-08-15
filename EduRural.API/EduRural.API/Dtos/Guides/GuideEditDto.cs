namespace EduRural.API.Dtos.Guides
{
    public class GuideEditDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string GradeId { get; set; }
        public string SubjectId { get; set; }

        public IFormFile File { get; set; }
    }
}
