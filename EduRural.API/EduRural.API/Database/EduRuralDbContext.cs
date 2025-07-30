using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EduRural.API.Database.Entities;
using EduRural.API.Database.Entities.Common;
using EduRural.API.Services.Interfaces;

namespace EduRural.API.Database
{
    public class EduRuralDbContext : IdentityDbContext<
        UserEntity,
        RoleEntity,
        string
    >
    {
        private readonly IAuditService _auditService;

        public EduRuralDbContext(DbContextOptions options,
            IAuditService auditService) : base(options)
        {
            _auditService = auditService;
        }

        public DbSet<GuideEntity> Guides { get; set; }
        public DbSet<GradeEntity> Grades { get; set; }
        public DbSet<SubjectEntity> Subjects { get; set; }

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

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                    e.State == EntityState.Added ||
                    e.State == EntityState.Modified
                ));

            foreach (var entityEntry in entries)
            {
                var entity = entityEntry.Entity as BaseEntity;
                if (entity != null)
                {
                    if (entityEntry.State == EntityState.Added)
                    {
                        entity.CreateDate = DateTime.Now;
                        entity.CreatedBy = _auditService.GetUserId();
                        entity.UpdatedDate = DateTime.Now;
                        entity.UpdatedBy = _auditService.GetUserId();
                    }
                    else
                    {
                        entity.UpdatedDate = DateTime.Now;
                        entity.UpdatedBy = _auditService.GetUserId();
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
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
