using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduRural.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDeleteCascade2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_edu_students_subjects_edu_students_student_id",
                table: "edu_students_subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_edu_students_subjects_edu_subjects_subject_id",
                table: "edu_students_subjects");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_students_subjects_edu_students_student_id",
                table: "edu_students_subjects",
                column: "student_id",
                principalTable: "edu_students",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_edu_students_subjects_edu_subjects_subject_id",
                table: "edu_students_subjects",
                column: "subject_id",
                principalTable: "edu_subjects",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_edu_students_subjects_edu_students_student_id",
                table: "edu_students_subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_edu_students_subjects_edu_subjects_subject_id",
                table: "edu_students_subjects");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_students_subjects_edu_students_student_id",
                table: "edu_students_subjects",
                column: "student_id",
                principalTable: "edu_students",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_students_subjects_edu_subjects_subject_id",
                table: "edu_students_subjects",
                column: "subject_id",
                principalTable: "edu_subjects",
                principalColumn: "id");
        }
    }
}
