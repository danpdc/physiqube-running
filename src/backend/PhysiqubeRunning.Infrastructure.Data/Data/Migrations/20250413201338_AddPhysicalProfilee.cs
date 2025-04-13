using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhysiqubeRunning.Infrastructure.Data.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPhysicalProfilee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HeartRateZones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaxHeartRate = table.Column<int>(type: "int", nullable: false),
                    RestingHeartRate = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeartRateZones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HeightHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HeightInMillimeters = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeightHistory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserPhysicalProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BiologicalSex = table.Column<int>(type: "int", nullable: false),
                    HeightInMillimeters = table.Column<int>(type: "int", nullable: false),
                    WeightInGrams = table.Column<int>(type: "int", nullable: false),
                    MaxHeartRate = table.Column<int>(type: "int", nullable: false),
                    RestingHeartRate = table.Column<int>(type: "int", nullable: true),
                    FitnessLevel = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPhysicalProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPhysicalProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeightHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WeightInGrams = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeightHistory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HeartRateZone",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LowerBound = table.Column<int>(type: "int", nullable: false),
                    UpperBound = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeartRateZonesId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeartRateZone", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HeartRateZone_HeartRateZones_HeartRateZonesId",
                        column: x => x.HeartRateZonesId,
                        principalTable: "HeartRateZones",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HeartRateZonesHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HeartRateZonesId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeartRateZonesHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HeartRateZonesHistory_HeartRateZones_HeartRateZonesId",
                        column: x => x.HeartRateZonesId,
                        principalTable: "HeartRateZones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HeartRateZone_HeartRateZonesId",
                table: "HeartRateZone",
                column: "HeartRateZonesId");

            migrationBuilder.CreateIndex(
                name: "IX_HeartRateZonesHistory_HeartRateZonesId",
                table: "HeartRateZonesHistory",
                column: "HeartRateZonesId");

            migrationBuilder.CreateIndex(
                name: "IX_HeightHistory_UserId",
                table: "HeightHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HeightHistory_UserId_RecordedAt",
                table: "HeightHistory",
                columns: new[] { "UserId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserPhysicalProfiles_UserId",
                table: "UserPhysicalProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WeightHistory_UserId",
                table: "WeightHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WeightHistory_UserId_RecordedAt",
                table: "WeightHistory",
                columns: new[] { "UserId", "RecordedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HeartRateZone");

            migrationBuilder.DropTable(
                name: "HeartRateZonesHistory");

            migrationBuilder.DropTable(
                name: "HeightHistory");

            migrationBuilder.DropTable(
                name: "UserPhysicalProfiles");

            migrationBuilder.DropTable(
                name: "WeightHistory");

            migrationBuilder.DropTable(
                name: "HeartRateZones");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "AspNetUsers");
        }
    }
}
