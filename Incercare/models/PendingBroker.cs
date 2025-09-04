using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Incercare;

[Table("pending_brokers")]
public class PendingBroker
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nume")]
    public string Nume { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("prenume")]
    public string Prenume { get; set; }

    [Required]
    [MaxLength(150)]
    [Column("email")]
    public string Email { get; set; }

    [Required]
    [Column("parola_hash")]
    public string ParolaHash { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("token")]
    public string Token { get; set; }

    [Column("data_cerere")]
    public DateTime DataCerere { get; set; } = DateTime.Now;
}
