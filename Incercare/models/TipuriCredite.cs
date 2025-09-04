using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incercare;

[Table("tipuri_credite")]
public partial class TipuriCredite
{
    public int IdTipCredit { get; set; }

    public string? NumeCredit { get; set; }

    public decimal? SumaMinima { get; set; }

    public decimal? SumaMaxima { get; set; }

    public decimal? DobandaMinima { get; set; }

    public decimal? DobandaMaxima { get; set; }

    [Column("perioada_minima")]
    public int? PerioadaMinima { get; set; }

    [Column("perioada_maxima")]
    public int? PerioadaMaxima { get; set; }


    [Column("tip_client")]
    public string TipClient { get; set; } = "fizic";

    public virtual ICollection<CereriCredit> CereriCredits { get; set; } = new List<CereriCredit>();

    public virtual ICollection<Credite> Credites { get; set; } = new List<Credite>();
}
