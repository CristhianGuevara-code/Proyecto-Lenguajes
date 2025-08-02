namespace EduRural.API.Dtos.Parents
{
    public class ParentCreateDto
    {
            public string UserId { get; set; }       // Usuario al que pertenece el padre
            public string PhoneNumber { get; set; }
            public string Address { get; set; }

            //Ids de los alumnos que va a asociar
            public List<string> StudentIds { get; set; }
        }

    }
