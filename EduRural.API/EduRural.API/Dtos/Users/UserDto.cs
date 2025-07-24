namespace EduRural.API.Dtos.Users
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public string AvatarUrl { get; set; }
        public List<string> Roles { get; set; }
    }
}
