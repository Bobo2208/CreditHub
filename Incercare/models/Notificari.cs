using System;
using System.Collections.Generic;

namespace Incercare;

public partial class Notificari
{
    public int IdNotificare { get; set; }

    public int? IdClient { get; set; }

    public string? Mesaj { get; set; }

    public DateTime? DataNotificare { get; set; }

    public virtual Clienti? IdClientNavigation { get; set; }
}
