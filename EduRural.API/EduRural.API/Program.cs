using EduRural.API.Database;
using EduRural.API.Database.Entities.Common;
using EduRural.API.Database.Entities;
using EduRural.API.Extensions;
using EduRural.API.Filters;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persons.API.Services;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Http.Features;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<EduRuralDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Acceder al contexto de la petición HTTP
builder.Services.AddHttpContextAccessor();

//Agrega el servicio de Automapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers(options =>
{
    options.Filters.Add(typeof(ValidateModelStateAttribute));
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
 
builder.Services.Configure<FormOptions>(o =>     // para subir PDF grandes
{
    o.MultipartBodyLengthLimit = 50 * 1024 * 1024; // 50 MB
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddTransient<IGradesService, GradesService>();
builder.Services.AddTransient<IGuidesService, GuidesService>();
builder.Services.AddTransient<IRolesService, RolesService>();
builder.Services.AddTransient<IUsersService, UsersService>();
builder.Services.AddTransient<ISubjectService, SubjectService>();
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IParentService, ParentService>();

builder.Services.AddCorsConfiguration(builder.Configuration);

builder.Services.AddAuthenticationConfig(builder.Configuration);


builder.Services.AddOpenApi();

var app = builder.Build();

// Ejecutar seeder al inicio
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
    await AdminRoleSeeder.SeedAdminRoleAsync(roleManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseStaticFiles(); // Para wwwroot

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
