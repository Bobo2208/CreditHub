using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incercare;

public partial class ClientiPersoaneJuridice
{
    public int IdClient { get; set; }

    public string? Denumire { get; set; }

    public string? Email { get; set; }

    public string? ParolaHash { get; set; }

    public string? Cui { get; set; }

    public string? Adresa { get; set; }

    public string? Telefon { get; set; }

    public string Nume { get; set; } = null!;
    public string Prenume { get; set; } = null!;

    [Column("venit_lunar")]
    public decimal? VenitLunar { get; set; }

    public string? TokenResetare { get; set; }
    public DateTime? TokenExpira { get; set; }


    public virtual Clienti IdClientNavigation { get; set; } = null!;
}
