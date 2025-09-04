using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Incercare.Migrations
{
    /// <inheritdoc />
    public partial class AddResetTokenFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:status_cerere", "in_asteptare,aprobata,respinsa")
                .Annotation("Npgsql:Enum:status_credit", "activ,inchis,intarziat")
                .Annotation("Npgsql:Enum:status_plata", "neplatita,platita,intarziata")
                .Annotation("Npgsql:Enum:tip_client", "fizic,juridic")
                .Annotation("Npgsql:Enum:tip_notificare", "scadenta,informativa,urgenta");*/

            migrationBuilder.CreateTable(
                name: "brokeri",
                columns: table => new
                {
                    id_broker = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    prenume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    parola_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    TokenResetare = table.Column<string>(type: "text", nullable: true),
                    TokenExpira = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("brokeri_pkey", x => x.id_broker);
                });

            migrationBuilder.CreateTable(
                name: "clienti",
                columns: table => new
                {
                    id_client = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()"),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()"),
                    tip_client = table.Column<string>(type: "text", nullable: true),
                    TokenResetare = table.Column<string>(type: "text", nullable: true),
                    TokenExpira = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("clienti_pkey", x => x.id_client);
                });

            migrationBuilder.CreateTable(
                name: "tipuri_credite",
                columns: table => new
                {
                    id_tip_credit = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nume_credit = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    suma_minima = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: true),
                    suma_maxima = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: true),
                    dobanda_minima = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    dobanda_maxima = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    tip_client = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("tipuri_credite_pkey", x => x.id_tip_credit);
                });

            migrationBuilder.CreateTable(
                name: "cereri_credit",
                columns: table => new
                {
                    id_cerere = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_client = table.Column<int>(type: "integer", nullable: true),
                    id_broker = table.Column<int>(type: "integer", nullable: true),
                    suma_solicitata = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: true),
                    perioada_luni = table.Column<int>(type: "integer", nullable: true),
                    dobanda = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("cereri_credit_pkey", x => x.id_cerere);
                    table.ForeignKey(
                        name: "cereri_credit_id_broker_fkey",
                        column: x => x.id_broker,
                        principalTable: "brokeri",
                        principalColumn: "id_broker");
                    table.ForeignKey(
                        name: "cereri_credit_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                });

            migrationBuilder.CreateTable(
                name: "clienti_persoane_fizice",
                columns: table => new
                {
                    id_client = table.Column<int>(type: "integer", nullable: false),
                    nume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    prenume = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    parola_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    cnp = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: true),
                    data_nastere = table.Column<DateOnly>(type: "date", nullable: true),
                    adresa = table.Column<string>(type: "text", nullable: true),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    TokenResetare = table.Column<string>(type: "text", nullable: true),
                    TokenExpira = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("clienti_persoane_fizice_pkey", x => x.id_client);
                    table.ForeignKey(
                        name: "clienti_persoane_fizice_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                });

            migrationBuilder.CreateTable(
                name: "clienti_persoane_juridice",
                columns: table => new
                {
                    id_client = table.Column<int>(type: "integer", nullable: false),
                    denumire = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    parola_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    cui = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    adresa = table.Column<string>(type: "text", nullable: true),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Nume = table.Column<string>(type: "text", nullable: false),
                    Prenume = table.Column<string>(type: "text", nullable: false),
                    TokenResetare = table.Column<string>(type: "text", nullable: true),
                    TokenExpira = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("clienti_persoane_juridice_pkey", x => x.id_client);
                    table.ForeignKey(
                        name: "clienti_persoane_juridice_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                });

            migrationBuilder.CreateTable(
                name: "documente",
                columns: table => new
                {
                    id_document = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_client = table.Column<int>(type: "integer", nullable: true),
                    tip_document = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    fisier_path = table.Column<string>(type: "text", nullable: true),
                    upload_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("documente_pkey", x => x.id_document);
                    table.ForeignKey(
                        name: "documente_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                });

            migrationBuilder.CreateTable(
                name: "log_actiuni",
                columns: table => new
                {
                    id_log = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_client = table.Column<int>(type: "integer", nullable: true),
                    actiune = table.Column<string>(type: "text", nullable: true),
                    data_actiune = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("log_actiuni_pkey", x => x.id_log);
                    table.ForeignKey(
                        name: "log_actiuni_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                });

            migrationBuilder.CreateTable(
                name: "notificari",
                columns: table => new
                {
                    id_notificare = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_client = table.Column<int>(type: "integer", nullable: true),
                    mesaj = table.Column<string>(type: "text", nullable: true),
                    data_notificare = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("notificari_pkey", x => x.id_notificare);
                    table.ForeignKey(
                        name: "notificari_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                });

            migrationBuilder.CreateTable(
                name: "credite",
                columns: table => new
                {
                    id_credit = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_client = table.Column<int>(type: "integer", nullable: true),
                    id_broker = table.Column<int>(type: "integer", nullable: true),
                    id_tip_credit = table.Column<int>(type: "integer", nullable: true),
                    suma = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: true),
                    dobanda = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    durata = table.Column<int>(type: "integer", nullable: true),
                    rata = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: true),
                    data_start = table.Column<DateOnly>(type: "date", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("credite_pkey", x => x.id_credit);
                    table.ForeignKey(
                        name: "credite_id_broker_fkey",
                        column: x => x.id_broker,
                        principalTable: "brokeri",
                        principalColumn: "id_broker");
                    table.ForeignKey(
                        name: "credite_id_client_fkey",
                        column: x => x.id_client,
                        principalTable: "clienti",
                        principalColumn: "id_client");
                    table.ForeignKey(
                        name: "credite_id_tip_credit_fkey",
                        column: x => x.id_tip_credit,
                        principalTable: "tipuri_credite",
                        principalColumn: "id_tip_credit");
                });

            migrationBuilder.CreateTable(
                name: "plati",
                columns: table => new
                {
                    id_plata = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_credit = table.Column<int>(type: "integer", nullable: true),
                    suma_platita = table.Column<decimal>(type: "numeric(15,2)", precision: 15, scale: 2, nullable: true),
                    data_plata = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("plati_pkey", x => x.id_plata);
                    table.ForeignKey(
                        name: "plati_id_credit_fkey",
                        column: x => x.id_credit,
                        principalTable: "credite",
                        principalColumn: "id_credit");
                });

            migrationBuilder.CreateIndex(
                name: "brokeri_email_key",
                table: "brokeri",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_cereri_credit_id_broker",
                table: "cereri_credit",
                column: "id_broker");

            migrationBuilder.CreateIndex(
                name: "IX_cereri_credit_id_client",
                table: "cereri_credit",
                column: "id_client");

            migrationBuilder.CreateIndex(
                name: "clienti_persoane_fizice_cnp_key",
                table: "clienti_persoane_fizice",
                column: "cnp",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "clienti_persoane_fizice_email_key",
                table: "clienti_persoane_fizice",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "clienti_persoane_juridice_cui_key",
                table: "clienti_persoane_juridice",
                column: "cui",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "clienti_persoane_juridice_email_key",
                table: "clienti_persoane_juridice",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_credite_id_broker",
                table: "credite",
                column: "id_broker");

            migrationBuilder.CreateIndex(
                name: "IX_credite_id_client",
                table: "credite",
                column: "id_client");

            migrationBuilder.CreateIndex(
                name: "IX_credite_id_tip_credit",
                table: "credite",
                column: "id_tip_credit");

            migrationBuilder.CreateIndex(
                name: "IX_documente_id_client",
                table: "documente",
                column: "id_client");

            migrationBuilder.CreateIndex(
                name: "IX_log_actiuni_id_client",
                table: "log_actiuni",
                column: "id_client");

            migrationBuilder.CreateIndex(
                name: "IX_notificari_id_client",
                table: "notificari",
                column: "id_client");

            migrationBuilder.CreateIndex(
                name: "IX_plati_id_credit",
                table: "plati",
                column: "id_credit");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cereri_credit");

            migrationBuilder.DropTable(
                name: "clienti_persoane_fizice");

            migrationBuilder.DropTable(
                name: "clienti_persoane_juridice");

            migrationBuilder.DropTable(
                name: "documente");

            migrationBuilder.DropTable(
                name: "log_actiuni");

            migrationBuilder.DropTable(
                name: "notificari");

            migrationBuilder.DropTable(
                name: "plati");

            migrationBuilder.DropTable(
                name: "credite");

            migrationBuilder.DropTable(
                name: "brokeri");

            migrationBuilder.DropTable(
                name: "clienti");

            migrationBuilder.DropTable(
                name: "tipuri_credite");
        }
    }
}
