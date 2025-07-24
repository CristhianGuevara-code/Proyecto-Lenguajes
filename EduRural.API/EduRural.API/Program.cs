using EduRural.API.Database;
using EduRural.API.Database.Entities;
using EduRural.API.Helpers;
using EduRural.API.Services;
using EduRural.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<EduRuralDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentity<UserEntity, RoleEntity>()
    .AddEntityFrameworkStores<EduRuralDbContext>()
    .AddDefaultTokenProviders();

//Agrega el servicio de Automapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddTransient<IGradesService, GradesService>();
builder.Services.AddTransient<IGuidesService, GuidesService>();
builder.Services.AddTransient<IRolesService, RolesService>();
builder.Services.AddTransient<IUsersService, UsersService>();


builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
