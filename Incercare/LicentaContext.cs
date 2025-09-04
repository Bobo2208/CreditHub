using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Incercare;

public partial class LicentaContext : DbContext
{
    public LicentaContext()
    {
    }

    public LicentaContext(DbContextOptions<LicentaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Brokeri> Brokeris { get; set; }

    public virtual DbSet<CereriCredit> CereriCredits { get; set; }

    public virtual DbSet<Clienti> Clientis { get; set; }

    public virtual DbSet<ClientiPersoaneFizice> ClientiPersoaneFizices { get; set; }

    public virtual DbSet<ClientiPersoaneJuridice> ClientiPersoaneJuridices { get; set; }

    public virtual DbSet<Credite> Credites { get; set; }

    public virtual DbSet<Documente> Documentes { get; set; }

    public virtual DbSet<LogActiuni> LogActiunis { get; set; }

    public virtual DbSet<Notificari> Notificaris { get; set; }

    public virtual DbSet<Plati> Platis { get; set; }

    public virtual DbSet<TipuriCredite> TipuriCredites { get; set; }

    public virtual DbSet<PendingBroker> PendingBrokers { get; set; }
    public object Cereris { get; internal set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=Licenta;Username=postgres;Password=dalabora");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum("status_cerere", new[] { "in_asteptare", "aprobata", "respinsa" })
            .HasPostgresEnum("status_credit", new[] { "activ", "inchis", "intarziat" })
            .HasPostgresEnum("status_plata", new[] { "neplatita", "platita", "intarziata" })
            .HasPostgresEnum("tip_client", new[] { "fizic", "juridic" })
            .HasPostgresEnum("tip_notificare", new[] { "scadenta", "informativa", "urgenta" });

        modelBuilder.Entity<Brokeri>(entity =>
        {
            entity.HasKey(e => e.IdBroker).HasName("brokeri_pkey");

            entity.ToTable("brokeri");

            entity.HasIndex(e => e.Email, "brokeri_email_key").IsUnique();

            entity.Property(e => e.IdBroker).HasColumnName("id_broker");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.Nume)
                .HasMaxLength(100)
                .HasColumnName("nume");
            entity.Property(e => e.ParolaHash)
                .HasMaxLength(255)
                .HasColumnName("parola_hash");
            entity.Property(e => e.Prenume)
                .HasMaxLength(100)
                .HasColumnName("prenume");
            entity.Property(e => e.Telefon)
                .HasMaxLength(20)
                .HasColumnName("telefon");
        });

        modelBuilder.Entity<CereriCredit>(entity =>
        {
            entity.HasKey(e => e.IdCerere).HasName("cereri_credit_pkey");

            entity.ToTable("cereri_credit");

            entity.Property(e => e.IdCerere).HasColumnName("id_cerere");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Dobanda)
                .HasPrecision(5, 2)
                .HasColumnName("dobanda");
            entity.Property(e => e.IdBroker).HasColumnName("id_broker");
            entity.Property(e => e.IdClient).HasColumnName("id_client");
            entity.Property(e => e.PerioadaLuni).HasColumnName("perioada_luni");
            entity.Property(e => e.SumaSolicitata)
                .HasPrecision(15, 2)
                .HasColumnName("suma_solicitata");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");
            entity.Property(e => e.Comentarii)
                .HasColumnName("comentarii");


            entity.HasOne(d => d.IdBrokerNavigation).WithMany(p => p.CereriCredits)
                .HasForeignKey(d => d.IdBroker)
                .HasConstraintName("cereri_credit_id_broker_fkey");

            entity.HasOne(d => d.IdClientNavigation).WithMany(p => p.CereriCredits)
                .HasForeignKey(d => d.IdClient)
                .HasConstraintName("cereri_credit_id_client_fkey");
            entity.HasOne(d => d.IdTipCreditNavigation)
                .WithMany(p => p.CereriCredits)
                .HasForeignKey(d => d.IdTipCredit)
                .HasConstraintName("cereri_credit_id_tip_credit_fkey");

        });

        modelBuilder.Entity<Clienti>(entity =>
        {
            entity.HasKey(e => e.IdClient).HasName("clienti_pkey");

            entity.ToTable("clienti");

            entity.Property(e => e.IdClient).HasColumnName("id_client");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<ClientiPersoaneFizice>(entity =>
        {
            entity.HasKey(e => e.IdClient).HasName("clienti_persoane_fizice_pkey");

            entity.ToTable("clienti_persoane_fizice");

            entity.HasIndex(e => e.Cnp, "clienti_persoane_fizice_cnp_key").IsUnique();

            entity.HasIndex(e => e.Email, "clienti_persoane_fizice_email_key").IsUnique();

            entity.Property(e => e.IdClient)
                .ValueGeneratedNever()
                .HasColumnName("id_client");
            entity.Property(e => e.Adresa).HasColumnName("adresa");
            entity.Property(e => e.Cnp)
                .HasMaxLength(13)
                .HasColumnName("cnp");
            entity.Property(e => e.DataNastere).HasColumnName("data_nastere");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.Nume)
                .HasMaxLength(100)
                .HasColumnName("nume");
            entity.Property(e => e.ParolaHash)
                .HasMaxLength(255)
                .HasColumnName("parola_hash");
            entity.Property(e => e.Prenume)
                .HasMaxLength(100)
                .HasColumnName("prenume");
            entity.Property(e => e.Telefon)
                .HasMaxLength(20)
                .HasColumnName("telefon");

            entity.HasOne(d => d.IdClientNavigation).WithOne(p => p.ClientiPersoaneFizice)
                .HasForeignKey<ClientiPersoaneFizice>(d => d.IdClient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("clienti_persoane_fizice_id_client_fkey");
        });

        modelBuilder.Entity<ClientiPersoaneJuridice>(entity =>
        {
            entity.HasKey(e => e.IdClient).HasName("clienti_persoane_juridice_pkey");

            entity.ToTable("clienti_persoane_juridice");

            entity.HasIndex(e => e.Cui, "clienti_persoane_juridice_cui_key").IsUnique();

            entity.HasIndex(e => e.Email, "clienti_persoane_juridice_email_key").IsUnique();

            entity.Property(e => e.IdClient)
                .ValueGeneratedNever()
                .HasColumnName("id_client");
            entity.Property(e => e.Adresa).HasColumnName("adresa");
            entity.Property(e => e.Cui)
                .HasMaxLength(20)
                .HasColumnName("cui");
            entity.Property(e => e.Denumire)
                .HasMaxLength(200)
                .HasColumnName("denumire");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.ParolaHash)
                .HasMaxLength(255)
                .HasColumnName("parola_hash");
            entity.Property(e => e.Telefon)
                .HasMaxLength(20)
                .HasColumnName("telefon");

            entity.HasOne(d => d.IdClientNavigation).WithOne(p => p.ClientiPersoaneJuridice)
                .HasForeignKey<ClientiPersoaneJuridice>(d => d.IdClient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("clienti_persoane_juridice_id_client_fkey");
        });

        modelBuilder.Entity<Credite>(entity =>
        {
            entity.HasKey(e => e.IdCredit).HasName("credite_pkey");

            entity.ToTable("credite");

            entity.Property(e => e.IdCredit).HasColumnName("id_credit");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.DataStart).HasColumnName("data_start");
            entity.Property(e => e.Dobanda)
                .HasPrecision(5, 2)
                .HasColumnName("dobanda");
            entity.Property(e => e.Durata).HasColumnName("durata");
            entity.Property(e => e.IdBroker).HasColumnName("id_broker");
            entity.Property(e => e.IdClient).HasColumnName("id_client");
            entity.Property(e => e.IdTipCredit).HasColumnName("id_tip_credit");
            entity.Property(e => e.Rata)
                .HasPrecision(15, 2)
                .HasColumnName("rata");
            entity.Property(e => e.Suma)
                .HasPrecision(15, 2)
                .HasColumnName("suma");
            entity.Property(e => e.Status)
                .HasColumnName("status");


            entity.HasOne(d => d.IdBrokerNavigation).WithMany(p => p.Credites)
                .HasForeignKey(d => d.IdBroker)
                .HasConstraintName("credite_id_broker_fkey");

            entity.HasOne(d => d.IdClientNavigation).WithMany(p => p.Credites)
                .HasForeignKey(d => d.IdClient)
                .HasConstraintName("credite_id_client_fkey");

            entity.HasOne(d => d.IdTipCreditNavigation).WithMany(p => p.Credites)
                .HasForeignKey(d => d.IdTipCredit)
                .HasConstraintName("credite_id_tip_credit_fkey");
        });

        modelBuilder.Entity<Documente>(entity =>
        {
            entity.HasKey(e => e.IdDocument).HasName("documente_pkey");

            entity.ToTable("documente");

            entity.Property(e => e.IdDocument).HasColumnName("id_document");
            entity.Property(e => e.FisierPath).HasColumnName("fisier_path");
            entity.Property(e => e.IdClient).HasColumnName("id_client");
            entity.Property(e => e.TipDocument)
                .HasMaxLength(100)
                .HasColumnName("tip_document");
            entity.Property(e => e.UploadDate)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("upload_date");

            entity.HasOne(d => d.IdClientNavigation).WithMany(p => p.Documentes)
                .HasForeignKey(d => d.IdClient)
                .HasConstraintName("documente_id_client_fkey");
        });

        modelBuilder.Entity<LogActiuni>(entity =>
        {
            entity.HasKey(e => e.IdLog).HasName("log_actiuni_pkey");

            entity.ToTable("log_actiuni");

            entity.Property(e => e.IdLog).HasColumnName("id_log");
            entity.Property(e => e.Actiune).HasColumnName("actiune");
            entity.Property(e => e.DataActiune)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("data_actiune");
            entity.Property(e => e.IdClient).HasColumnName("id_client");

            entity.HasOne(d => d.IdClientNavigation).WithMany(p => p.LogActiunis)
                .HasForeignKey(d => d.IdClient)
                .HasConstraintName("log_actiuni_id_client_fkey");
        });

        modelBuilder.Entity<Notificari>(entity =>
        {
            entity.HasKey(e => e.IdNotificare).HasName("notificari_pkey");

            entity.ToTable("notificari");

            entity.Property(e => e.IdNotificare).HasColumnName("id_notificare");
            entity.Property(e => e.DataNotificare)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("data_notificare");
            entity.Property(e => e.IdClient).HasColumnName("id_client");
            entity.Property(e => e.Mesaj).HasColumnName("mesaj");

            entity.HasOne(d => d.IdClientNavigation).WithMany(p => p.Notificaris)
                .HasForeignKey(d => d.IdClient)
                .HasConstraintName("notificari_id_client_fkey");
        });

        modelBuilder.Entity<Plati>(entity =>
        {
            entity.HasKey(e => e.IdPlata).HasName("plati_pkey");

            entity.ToTable("plati");

            entity.Property(e => e.IdPlata).HasColumnName("id_plata");
            entity.Property(e => e.DataPlata).HasColumnName("data_plata");
            entity.Property(e => e.IdCredit).HasColumnName("id_credit");
            entity.Property(e => e.SumaPlatita)
                .HasPrecision(15, 2)
                .HasColumnName("suma_platita");

            entity.HasOne(d => d.IdCreditNavigation).WithMany(p => p.Platis)
                .HasForeignKey(d => d.IdCredit)
                .HasConstraintName("plati_id_credit_fkey");
        });

        modelBuilder.Entity<TipuriCredite>(entity =>
        {
            entity.HasKey(e => e.IdTipCredit).HasName("tipuri_credite_pkey");

            entity.ToTable("tipuri_credite");

            entity.Property(e => e.IdTipCredit).HasColumnName("id_tip_credit");
            entity.Property(e => e.DobandaMaxima)
                .HasPrecision(5, 2)
                .HasColumnName("dobanda_maxima");
            entity.Property(e => e.DobandaMinima)
                .HasPrecision(5, 2)
                .HasColumnName("dobanda_minima");
            entity.Property(e => e.NumeCredit)
                .HasMaxLength(100)
                .HasColumnName("nume_credit");
            entity.Property(e => e.SumaMaxima)
                .HasPrecision(15, 2)
                .HasColumnName("suma_maxima");
            entity.Property(e => e.SumaMinima)
                .HasPrecision(15, 2)
                .HasColumnName("suma_minima");
        });

        modelBuilder.Entity<PendingBroker>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pending_brokers_pkey");

            entity.ToTable("pending_brokers");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Nume).IsRequired().HasMaxLength(100).HasColumnName("nume");
            entity.Property(e => e.Prenume).IsRequired().HasMaxLength(100).HasColumnName("prenume");
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150).HasColumnName("email");
            entity.Property(e => e.ParolaHash).IsRequired().HasColumnName("parola_hash");
            entity.Property(e => e.Token).IsRequired().HasMaxLength(100).HasColumnName("token");
            entity.Property(e => e.DataCerere)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("data_cerere");

            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Token).IsUnique();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
