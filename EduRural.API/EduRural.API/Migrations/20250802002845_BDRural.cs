using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduRural.API.Migrations
{
    /// <inheritdoc />
    public partial class BDRural : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "edu_subjects",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_subjects", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sec_roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "sec_users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    avatar_url = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    birth_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "sec_users_roles_claims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_users_roles_claims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sec_users_roles_claims_sec_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "sec_roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "edu_parents",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    phone_number = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    address = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_parents", x => x.id);
                    table.ForeignKey(
                        name: "FK_edu_parents_sec_users_UserId",
                        column: x => x.UserId,
                        principalTable: "sec_users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "edu_teachers",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    user_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    phone_number = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    specialty = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_teachers", x => x.id);
                    table.ForeignKey(
                        name: "FK_edu_teachers_sec_users_user_id",
                        column: x => x.user_id,
                        principalTable: "sec_users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "sec_users_claims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_users_claims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sec_users_claims_sec_users_UserId",
                        column: x => x.UserId,
                        principalTable: "sec_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sec_users_logins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_users_logins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_sec_users_logins_sec_users_UserId",
                        column: x => x.UserId,
                        principalTable: "sec_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sec_users_roles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_users_roles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_sec_users_roles_sec_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "sec_roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_sec_users_roles_sec_users_UserId",
                        column: x => x.UserId,
                        principalTable: "sec_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sec_users_tokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sec_users_tokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_sec_users_tokens_sec_users_UserId",
                        column: x => x.UserId,
                        principalTable: "sec_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "edu_grades",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    teacher_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_grades", x => x.id);
                    table.ForeignKey(
                        name: "FK_edu_grades_edu_teachers_teacher_id",
                        column: x => x.teacher_id,
                        principalTable: "edu_teachers",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "edu_guides",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    file_path = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    upload_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    grade_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    uploaded_by_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    subject_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    teacher_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_guides", x => x.id);
                    table.ForeignKey(
                        name: "FK_edu_guides_edu_grades_grade_id",
                        column: x => x.grade_id,
                        principalTable: "edu_grades",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_edu_guides_edu_subjects_subject_id",
                        column: x => x.subject_id,
                        principalTable: "edu_subjects",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_edu_guides_edu_teachers_teacher_id",
                        column: x => x.teacher_id,
                        principalTable: "edu_teachers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_edu_guides_sec_users_uploaded_by_id",
                        column: x => x.uploaded_by_id,
                        principalTable: "sec_users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "edu_students",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    birth_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    grade_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    parent_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_students", x => x.id);
                    table.ForeignKey(
                        name: "FK_edu_students_edu_grades_grade_id",
                        column: x => x.grade_id,
                        principalTable: "edu_grades",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_edu_students_edu_parents_parent_id",
                        column: x => x.parent_id,
                        principalTable: "edu_parents",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "edu_students_subjects",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    student_id = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    subject_id = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_edu_students_subjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_edu_students_subjects_edu_students_student_id",
                        column: x => x.student_id,
                        principalTable: "edu_students",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_edu_students_subjects_edu_subjects_subject_id",
                        column: x => x.subject_id,
                        principalTable: "edu_subjects",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_edu_grades_teacher_id",
                table: "edu_grades",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_guides_grade_id",
                table: "edu_guides",
                column: "grade_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_guides_subject_id",
                table: "edu_guides",
                column: "subject_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_guides_teacher_id",
                table: "edu_guides",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_guides_uploaded_by_id",
                table: "edu_guides",
                column: "uploaded_by_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_parents_UserId",
                table: "edu_parents",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_edu_students_grade_id",
                table: "edu_students",
                column: "grade_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_students_parent_id",
                table: "edu_students",
                column: "parent_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_students_subjects_student_id",
                table: "edu_students_subjects",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_students_subjects_subject_id",
                table: "edu_students_subjects",
                column: "subject_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_teachers_user_id",
                table: "edu_teachers",
                column: "user_id",
                unique: true,
                filter: "[user_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "sec_roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "sec_users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "sec_users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_sec_users_claims_UserId",
                table: "sec_users_claims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_sec_users_logins_UserId",
                table: "sec_users_logins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_sec_users_roles_RoleId",
                table: "sec_users_roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_sec_users_roles_claims_RoleId",
                table: "sec_users_roles_claims",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "edu_guides");

            migrationBuilder.DropTable(
                name: "edu_students_subjects");

            migrationBuilder.DropTable(
                name: "sec_users_claims");

            migrationBuilder.DropTable(
                name: "sec_users_logins");

            migrationBuilder.DropTable(
                name: "sec_users_roles");

            migrationBuilder.DropTable(
                name: "sec_users_roles_claims");

            migrationBuilder.DropTable(
                name: "sec_users_tokens");

            migrationBuilder.DropTable(
                name: "edu_students");

            migrationBuilder.DropTable(
                name: "edu_subjects");

            migrationBuilder.DropTable(
                name: "sec_roles");

            migrationBuilder.DropTable(
                name: "edu_grades");

            migrationBuilder.DropTable(
                name: "edu_parents");

            migrationBuilder.DropTable(
                name: "edu_teachers");

            migrationBuilder.DropTable(
                name: "sec_users");
        }
    }
}
