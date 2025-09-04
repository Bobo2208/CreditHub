using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using Incercare;

namespace Incercare.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "fizic,juridic,broker")]
    public class CerereCreditController : ControllerBase
    {
        private readonly LicentaContext _context;

        public CerereCreditController(LicentaContext context)
        {
            _context = context;
        }

        public class CerereCreditDto
        {
            public int IdTipCredit { get; set; }
            public decimal Suma { get; set; }
            public int PerioadaLuni { get; set; }
        }

        public class RejectPayload
        {
            public List<string> Reasons { get; set; } = new List<string>();
            public string? Comment { get; set; }
        }

        [HttpGet("client")]
        public async Task<IActionResult> GetCereriClient()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            var clientId = int.Parse(userId);

            var cereri = await _context.CereriCredits
                .Include(c => c.IdTipCreditNavigation)
                .Where(c => c.IdClient == clientId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var result = cereri.Select(c => {
                decimal? dobandaAfisata = c.Dobanda;
                if (dobandaAfisata == null && c.IdTipCreditNavigation != null)
                {
                    dobandaAfisata = c.IdTipCreditNavigation.DobandaMinima;
                }
                
                if (dobandaAfisata == null)
                {
                    dobandaAfisata = 5.5m; 
                }

                return new
                {
                    c.IdCerere,
                    c.SumaSolicitata,
                    c.PerioadaLuni,
                    Dobanda = dobandaAfisata,
                    c.Comentarii,
                    c.CreatedAt,
                    TipCredit = c.IdTipCreditNavigation.NumeCredit
                };
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Aplicare([FromBody] CerereCreditDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            var clientId = int.Parse(userId);

            decimal venitLunar = 0;
            var fizic = await _context.ClientiPersoaneFizices.FirstOrDefaultAsync(c => c.IdClient == clientId);
            var juridic = await _context.ClientiPersoaneJuridices.FirstOrDefaultAsync(c => c.IdClient == clientId);
            if (fizic != null) venitLunar = fizic.VenitLunar ?? 0;
            else if (juridic != null) venitLunar = juridic.VenitLunar ?? 0;

            if (venitLunar <= 0)
                return BadRequest(new { message = "Venitul lunar nu este setat. Nu se poate trimite cererea." });

            var sumaRateActive = await _context.Credites
                .Where(c => c.IdClient == clientId && c.Status == "activ" && c.Rata.HasValue)
                .SumAsync(c => c.Rata.Value);

            decimal rataNoua = dto.PerioadaLuni > 0
                ? Math.Round(dto.Suma / dto.PerioadaLuni, 2)
                : 0;

            if ((sumaRateActive + rataNoua) > venitLunar * 0.4m)
            {
                return BadRequest(new { message = "Gradul de îndatorare depășește 40% din venitul lunar. Nu poți trimite cererea." });
            }

            var broker = await _context.Brokeris
                .OrderBy(b => Guid.NewGuid())
                .FirstOrDefaultAsync();
            if (broker == null)
                return BadRequest(new { message = "Nu există brokeri disponibili pentru preluarea cererii." });

            var cerere = new CereriCredit
            {
                IdClient = clientId,
                IdBroker = broker.IdBroker,
                IdTipCredit = dto.IdTipCredit,
                SumaSolicitata = dto.Suma,
                PerioadaLuni = dto.PerioadaLuni,
                CreatedAt = DateTime.Now,
                Status = "in_asteptare",
                Comentarii = null
            };

            _context.CereriCredits.Add(cerere);
            await _context.SaveChangesAsync();
            return Ok(new { mesaj = "Cererea a fost trimisă și alocată unui broker." });
        }

        [HttpPost("respinge/{idCerere}")]
        public async Task<IActionResult> RejectCerere(int idCerere, [FromBody] RejectPayload payload)
        {
            var cerere = await _context.CereriCredits.FindAsync(idCerere);
            if (cerere == null) return NotFound();

            cerere.Status = "respinsa";
            var obj = new { reasons = payload.Reasons, comment = payload.Comment };
            cerere.Comentarii = JsonSerializer.Serialize(obj);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("eligibilitate")]
        public async Task<IActionResult> VerificaEligibilitate([FromQuery] decimal? suma, [FromQuery] int? perioadaLuni)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            var clientId = int.Parse(userId);

            decimal venitLunar = 0;
            var fizic = await _context.ClientiPersoaneFizices.FirstOrDefaultAsync(c => c.IdClient == clientId);
            var juridic = await _context.ClientiPersoaneJuridices.FirstOrDefaultAsync(c => c.IdClient == clientId);
            if (fizic != null) venitLunar = fizic.VenitLunar ?? 0;
            else if (juridic != null) venitLunar = juridic.VenitLunar ?? 0;

            var sumaRateActive = await _context.Credites
                .Where(c => c.IdClient == clientId && c.Status == "activ" && c.Rata.HasValue)
                .SumAsync(c => c.Rata.Value);

            decimal rataNoua = (suma.HasValue && perioadaLuni.HasValue && perioadaLuni > 0)
                ? Math.Round(suma.Value / perioadaLuni.Value, 2)
                : 0;

            decimal gradIndatorare = venitLunar > 0
                ? Math.Round((sumaRateActive + rataNoua) / venitLunar * 100, 2)
                : 0;

            return Ok(new { sumaRateActive, rataNoua, venitLunar, gradIndatorare });
        }

        [HttpGet("debug-tipuri-credite")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> DebugTipuriCredite()
        {
            try
            {
                var tipuriCredite = await _context.TipuriCredites
                    .Select(tc => new
                    {
                        tc.IdTipCredit,
                        tc.NumeCredit,
                        tc.DobandaMinima,
                        tc.DobandaMaxima,
                        tc.TipClient
                    })
                    .ToListAsync();

                return Ok(new { 
                    message = "Tipuri de credite din baza de date",
                    tipuriCredite,
                    count = tipuriCredite.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Eroare: {ex.Message}" });
            }
        }
    }
}
