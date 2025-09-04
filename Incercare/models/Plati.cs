using System;
using System.Collections.Generic;

namespace Incercare;

public partial class Plati
{
    public int IdPlata { get; set; }

    public int? IdCredit { get; set; }

    public decimal? SumaPlatita { get; set; }

    public DateOnly? DataPlata { get; set; }

    public virtual Credite? IdCreditNavigation { get; set; }
}
