using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduRural.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDeleteCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_edu_teachers_subjects_edu_subjects_subject_id",
                table: "edu_teachers_subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_edu_teachers_subjects_edu_teachers_teacher_id",
                table: "edu_teachers_subjects");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_teachers_subjects_edu_subjects_subject_id",
                table: "edu_teachers_subjects",
                column: "subject_id",
                principalTable: "edu_subjects",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_edu_teachers_subjects_edu_teachers_teacher_id",
                table: "edu_teachers_subjects",
                column: "teacher_id",
                principalTable: "edu_teachers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_edu_teachers_subjects_edu_subjects_subject_id",
                table: "edu_teachers_subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_edu_teachers_subjects_edu_teachers_teacher_id",
                table: "edu_teachers_subjects");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_teachers_subjects_edu_subjects_subject_id",
                table: "edu_teachers_subjects",
                column: "subject_id",
                principalTable: "edu_subjects",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_teachers_subjects_edu_teachers_teacher_id",
                table: "edu_teachers_subjects",
                column: "teacher_id",
                principalTable: "edu_teachers",
                principalColumn: "id");
        }
    }
}
