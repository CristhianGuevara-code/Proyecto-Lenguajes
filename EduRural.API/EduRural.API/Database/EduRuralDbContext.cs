using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EduRural.API.Database.Entities;

namespace EduRural.API.Database
{
    public class EduRuralDbContext : IdentityDbContext<
        UserEntity,
        RoleEntity,
        string
    >
    {
        public EduRuralDbContext(DbContextOptions options) : base(options) { }

        public DbSet<GuideEntity> Guides { get; set; }
        public DbSet<GradeEntity> Grades { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            SetIdentityTablesNames(builder);

            builder.Entity<GuideEntity>()
                .HasOne(g => g.Grade)
                .WithMany(g => g.Guides)
                .HasForeignKey(g => g.GradeId);

            builder.Entity<GuideEntity>()
                .HasOne(g => g.UploadedBy)
                .WithMany(u => u.Guides)
                .HasForeignKey(g => g.UploadedById);
        }

        private static void SetIdentityTablesNames(ModelBuilder builder)
        {
            builder.Entity<UserEntity>().ToTable("sec_users");
            builder.Entity<RoleEntity>().ToTable("sec_roles");
            builder.Entity<IdentityUserRole<string>>().ToTable("sec_users_roles")
                .HasKey(ur => new { ur.UserId, ur.RoleId });
            builder.Entity<IdentityUserClaim<string>>().ToTable("sec_users_claims");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("sec_users_roles_claims");
            builder.Entity<IdentityUserLogin<string>>().ToTable("sec_users_logins");
            builder.Entity<IdentityUserToken<string>>().ToTable("sec_users_tokens");
        }
    }
}
