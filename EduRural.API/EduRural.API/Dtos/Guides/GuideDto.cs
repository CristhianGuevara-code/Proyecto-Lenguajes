namespace EduRural.API.Dtos.Guides
{
    public class GuideDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
        public string GradeName { get; set; }
        public string UploadedByName { get; set; }
    }
}
