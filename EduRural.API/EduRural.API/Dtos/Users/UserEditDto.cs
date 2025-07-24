namespace EduRural.API.Dtos.Users
{
    public class UserEditDto : UserCreateDto
    {
        public bool ChangePassword { get; set; }
    }
}
