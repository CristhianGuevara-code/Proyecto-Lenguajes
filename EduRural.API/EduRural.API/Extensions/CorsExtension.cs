namespace EduRural.API.Extensions
{
    // CorsExtension.cs
    public static class CorsExtension
    {
        public static IServiceCollection AddCorsConfiguration(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddCors(opt =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                opt.AddPolicy("CorsPolicy", builder =>
                {
                    if (env == "Development")
                    {
                        // Acepta cualquier puerto de localhost/127.0.0.1 en DEV
                        builder
                            .SetIsOriginAllowed(origin =>
                            {
                                try
                                {
                                    var u = new Uri(origin);
                                    return u.Host == "localhost" || u.Host == "127.0.0.1";
                                }
                                catch { return false; }
                            })
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    }
                    else
                    {
                        var allowURLs = configuration.GetSection("AllowURLs").Get<string[]>() ?? Array.Empty<string>();
                        builder
                            .WithOrigins(allowURLs)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    }
                });
            });

            return services;
        }
    }
}


