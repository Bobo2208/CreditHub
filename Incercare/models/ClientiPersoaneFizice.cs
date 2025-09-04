using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incercare;

public partial class ClientiPersoaneFizice
{
    public int IdClient { get; set; }

    public string? Nume { get; set; }

    public string? Prenume { get; set; }

    public string? Email { get; set; }

    public string? ParolaHash { get; set; }

    public string? Cnp { get; set; }

    public DateOnly? DataNastere { get; set; }

    public string? Adresa { get; set; }

    public string? Telefon { get; set; }

    [Column("venit_lunar")]
    public decimal? VenitLunar { get; set; }

    public string? TokenResetare { get; set; }
    public DateTime? TokenExpira { get; set; }


    public virtual Clienti IdClientNavigation { get; set; } = null!;

    
}
