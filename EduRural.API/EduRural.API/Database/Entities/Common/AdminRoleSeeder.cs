using Microsoft.AspNetCore.Identity;

namespace EduRural.API.Database.Entities.Common
{
    public class AdminRoleSeeder
    {
        public static async Task SeedAdminRoleAsync(RoleManager<RoleEntity> roleManager)
        {
            const string adminRoleName = "ADMIN";

            // Verificar si el rol ADMIN ya existe
            var roleExists = await roleManager.RoleExistsAsync(adminRoleName);
            if (!roleExists)
            {
                var adminRole = new RoleEntity
                {
                    Name = adminRoleName,
                    NormalizedName = adminRoleName.ToUpper(),
                    Description = "Rol con privilegios administrativos completos"
                };

                var result = await roleManager.CreateAsync(adminRole);
                if (!result.Succeeded)
                {
                    throw new Exception($"Error al crear el rol ADMIN: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}
