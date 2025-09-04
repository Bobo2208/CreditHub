using System;
using System.Collections.Generic;

namespace Incercare;

public partial class Credite
{
    public int IdCredit { get; set; }

    public int? IdClient { get; set; }

    public int? IdBroker { get; set; }

    public int? IdTipCredit { get; set; }

    public decimal? Suma { get; set; }

    public decimal? Dobanda { get; set; }

    public int? Durata { get; set; }

    public decimal? Rata { get; set; }
    
    public string? Status { get; set; }

    public DateOnly? DataStart { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Brokeri? IdBrokerNavigation { get; set; }

    public virtual Clienti? IdClientNavigation { get; set; }

    public virtual TipuriCredite? IdTipCreditNavigation { get; set; }

    public virtual ICollection<Plati> Platis { get; set; } = new List<Plati>();
}
