using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduRural.API.Migrations
{
    /// <inheritdoc />
    public partial class DeleteRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_edu_subjects_edu_teachers_TeacherEntityId",
                table: "edu_subjects");

            migrationBuilder.DropIndex(
                name: "IX_edu_subjects_TeacherEntityId",
                table: "edu_subjects");

            migrationBuilder.DropColumn(
                name: "TeacherEntityId",
                table: "edu_subjects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeacherEntityId",
                table: "edu_subjects",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_edu_subjects_TeacherEntityId",
                table: "edu_subjects",
                column: "TeacherEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_edu_subjects_edu_teachers_TeacherEntityId",
                table: "edu_subjects",
                column: "TeacherEntityId",
                principalTable: "edu_teachers",
                principalColumn: "id");
        }
    }
}
