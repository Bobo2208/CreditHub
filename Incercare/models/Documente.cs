using System;
using System.Collections.Generic;

namespace Incercare;

public partial class Documente
{
    public int IdDocument { get; set; }

    public int? IdClient { get; set; }

    public string? TipDocument { get; set; }

    public string? FisierPath { get; set; }

    public DateTime? UploadDate { get; set; }

    public virtual Clienti? IdClientNavigation { get; set; }
}
