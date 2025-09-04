using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incercare;

public partial class Clienti
{
    public int IdClient { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [Column("tip_client")]
    public string? TipClient { get; set; }

    public string? TokenResetare { get; set; }
    public DateTime? TokenExpira { get; set; }


    public virtual ICollection<CereriCredit> CereriCredits { get; set; } = new List<CereriCredit>();
    public virtual ClientiPersoaneFizice? ClientiPersoaneFizice { get; set; }
    public virtual ClientiPersoaneJuridice? ClientiPersoaneJuridice { get; set; }
    public virtual ICollection<Credite> Credites { get; set; } = new List<Credite>();
    public virtual ICollection<Documente> Documentes { get; set; } = new List<Documente>();
    public virtual ICollection<LogActiuni> LogActiunis { get; set; } = new List<LogActiuni>();
    public virtual ICollection<Notificari> Notificaris { get; set; } = new List<Notificari>();
}
