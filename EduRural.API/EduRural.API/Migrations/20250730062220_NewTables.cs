using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduRural.API.Migrations
{
    /// <inheritdoc />
    public partial class NewTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "teacher_id",
                table: "edu_guides",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "teacher_id",
                table: "edu_grades",
                type: "nvarchar(450)",
                nullable: true);

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
                name: "IX_edu_guides_teacher_id",
                table: "edu_guides",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "IX_edu_grades_teacher_id",
                table: "edu_grades",
                column: "teacher_id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_edu_grades_edu_teachers_teacher_id",
                table: "edu_grades",
                column: "teacher_id",
                principalTable: "edu_teachers",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_guides_edu_teachers_teacher_id",
                table: "edu_guides",
                column: "teacher_id",
                principalTable: "edu_teachers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_edu_grades_edu_teachers_teacher_id",
                table: "edu_grades");

            migrationBuilder.DropForeignKey(
                name: "FK_edu_guides_edu_teachers_teacher_id",
                table: "edu_guides");

            migrationBuilder.DropTable(
                name: "edu_students_subjects");

            migrationBuilder.DropTable(
                name: "edu_teachers");

            migrationBuilder.DropTable(
                name: "edu_students");

            migrationBuilder.DropTable(
                name: "edu_parents");

            migrationBuilder.DropIndex(
                name: "IX_edu_guides_teacher_id",
                table: "edu_guides");

            migrationBuilder.DropIndex(
                name: "IX_edu_grades_teacher_id",
                table: "edu_grades");

            migrationBuilder.DropColumn(
                name: "teacher_id",
                table: "edu_guides");

            migrationBuilder.DropColumn(
                name: "teacher_id",
                table: "edu_grades");
        }
    }
}
