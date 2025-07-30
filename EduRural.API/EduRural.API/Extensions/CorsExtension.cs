namespace EduRural.API.Extensions
{
    public static class CorsExtension
    {
        public static IServiceCollection AddCorsConfiguration(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddCors(opt =>
            {
                var allowURLS = configuration.GetSection("AllowURLs").Get<string[]>();

                if (allowURLS == null)
                {
                    allowURLS = [""];
                }

                opt.AddPolicy("CorsPolicy", builder => builder
                .WithOrigins(allowURLS)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
            });

            return services;
        }
    }
}

