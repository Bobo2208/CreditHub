using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incercare;

public partial class CereriCredit
{
    public int IdCerere { get; set; }

    public int? IdClient { get; set; }

    public int? IdBroker { get; set; }

    [Column("id_tip_credit")]
    public int? IdTipCredit { get; set; }

    public decimal? SumaSolicitata { get; set; }

    public int? PerioadaLuni { get; set; }

    public decimal? Dobanda { get; set; }

    public string? Status { get; set; }

    public string? Comentarii { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Brokeri? IdBrokerNavigation { get; set; }

    public virtual Clienti? IdClientNavigation { get; set; }

    [ForeignKey("IdTipCredit")]
    public virtual TipuriCredite? IdTipCreditNavigation { get; set; }
}
