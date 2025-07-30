namespace EduRural.API.Dtos.Guides
{
    public class GuideCreateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string GradeId { get; set; }
        public string SubjectId { get; set; }
        public string FilePath { get; set; }
    }
}
