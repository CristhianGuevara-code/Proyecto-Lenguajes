using EduRural.API.Database;
using EduRural.API.Extensions;
using EduRural.API.Filters;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<EduRuralDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Acceder al contexto de la petición HTTP
builder.Services.AddHttpContextAccessor();

//builder.Services.AddIdentity<UserEntity, RoleEntity>()
//    .AddEntityFrameworkStores<EduRuralDbContext>()
//    .AddDefaultTokenProviders();

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

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddTransient<IGradesService, GradesService>();
builder.Services.AddTransient<IGuidesService, GuidesService>();
builder.Services.AddTransient<IRolesService, RolesService>();
builder.Services.AddTransient<IUsersService, UsersService>();
builder.Services.AddTransient<ISubjectService, SubjectService>();
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddScoped<IAuditService, AuditService>();

builder.Services.AddCorsConfiguration(builder.Configuration);

builder.Services.AddAuthenticationConfig(builder.Configuration);


builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
