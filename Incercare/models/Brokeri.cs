using System;
using System.Collections.Generic;

namespace Incercare;

public partial class Brokeri
{
    public int IdBroker { get; set; }

    public string? Nume { get; set; }

    public string? Prenume { get; set; }

    public string? Email { get; set; }

    public string? ParolaHash { get; set; }

    public string? Telefon { get; set; }

    public string? TokenResetare { get; set; }
    public DateTime? TokenExpira { get; set; }


    public virtual ICollection<CereriCredit> CereriCredits { get; set; } = new List<CereriCredit>();

    public virtual ICollection<Credite> Credites { get; set; } = new List<Credite>();
}
