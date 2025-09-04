using System;
using System.Collections.Generic;

namespace Incercare;

public partial class LogActiuni
{
    public int IdLog { get; set; }

    public int? IdClient { get; set; }

    public string? Actiune { get; set; }

    public DateTime? DataActiune { get; set; }

    public virtual Clienti? IdClientNavigation { get; set; }
}
