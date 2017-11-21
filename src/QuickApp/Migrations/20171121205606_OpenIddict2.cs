using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace QuickApp.Migrations
{
    public partial class OpenIddict2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Scope",
                table: "OpenIddictAuthorizations",
                newName: "Scopes");
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "OpenIddictAuthorizations",
                nullable: false,
                defaultValue: "");
            migrationBuilder.AddColumn<byte[]>(
                name: "Timestamp",
                table: "OpenIddictAuthorizations",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationDate",
                table: "OpenIddictTokens",
                rowVersion: true,
                nullable: true);
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationDate",
                table: "OpenIddictTokens",
                rowVersion: true,
                nullable: true);
            migrationBuilder.AddColumn<byte[]>(
                name: "Timestamp",
                table: "OpenIddictTokens",
                rowVersion: true,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Scopes",
                table: "OpenIddictAuthorizations",
                newName: "Scope");
            migrationBuilder.DropColumn(
                name: "Type",
                table: "OpenIddictAuthorizations");
            migrationBuilder.DropColumn(
                name: "Timestamp",
                table: "OpenIddictAuthorizations");
            migrationBuilder.DropColumn(
                name: "CreationDate",
                table: "OpenIddictTokens");
            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "OpenIddictTokens");
            migrationBuilder.DropColumn(
                name: "Timestamp",
                table: "OpenIddictTokens");
        }
    }
}
