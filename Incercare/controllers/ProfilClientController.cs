// ProfilController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Incercare.Controllers
{
    [ApiController]
    [Route("api/profil")]
    public class ProfilController : ControllerBase
    {
        private readonly LicentaContext _context;

        public ProfilController(LicentaContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("{tip}")]
        public async Task<IActionResult> GetProfil(string tip)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (tip == "fizic")
            {
                var client = await _context.ClientiPersoaneFizices
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.IdClient == userId);
                if (client == null) return NotFound();
                return Ok(client);
            }

            if (tip == "juridic")
            {
                var client = await _context.ClientiPersoaneJuridices
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.IdClient == userId);
                if (client == null) return NotFound();
                return Ok(client);
            }

            return BadRequest("Tip invalid");
        }

        [Authorize]
        [HttpPut("fizic")]
        public async Task<IActionResult> UpdateProfilFizic([FromBody] UpdateProfilFizicDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existing = await _context.ClientiPersoaneFizices.FindAsync(userId);
            if (existing == null) return NotFound();

            if (dto.Email != null) existing.Email = dto.Email;
            if (dto.Telefon != null) existing.Telefon = dto.Telefon;
            if (dto.Nume != null) existing.Nume = dto.Nume;
            if (dto.Prenume != null) existing.Prenume = dto.Prenume;
            if (dto.Adresa != null) existing.Adresa = dto.Adresa;
            if (dto.VenitLunar != null) existing.VenitLunar = dto.VenitLunar;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPut("juridic")]
        public async Task<IActionResult> UpdateProfilJuridic([FromBody] UpdateProfilJuridicDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var existing = await _context.ClientiPersoaneJuridices.FindAsync(userId);
            if (existing == null) return NotFound();

            if (dto.Email != null) existing.Email = dto.Email;
            if (dto.Telefon != null) existing.Telefon = dto.Telefon;
            if (dto.Denumire != null) existing.Denumire = dto.Denumire;
            if (dto.Adresa != null) existing.Adresa = dto.Adresa;
            if (dto.VenitLunar != null) existing.VenitLunar = dto.VenitLunar;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = "broker")]
        [HttpGet("client/{id}")]
        public async Task<IActionResult> GetProfilClientById(int id)
        {
            var clientFizic = await _context.ClientiPersoaneFizices
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.IdClient == id);
            if (clientFizic != null)
            {
                return Ok(new
                {
                    clientFizic.IdClient,
                    clientFizic.Nume,
                    clientFizic.Prenume,
                    clientFizic.Cnp,
                    clientFizic.VenitLunar,
                    Tip = "fizic"
                });
            }

            var clientJuridic = await _context.ClientiPersoaneJuridices
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.IdClient == id);
            if (clientJuridic != null)
            {
                return Ok(new
                {
                    clientJuridic.IdClient,
                    Denumire = clientJuridic.Denumire,
                    clientJuridic.Cui,
                    clientJuridic.VenitLunar,
                    Tip = "juridic"
                });
            }

            return NotFound();
        }
    }

    public class UpdateProfilFizicDto
    {
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string? Nume { get; set; }
        public string? Prenume { get; set; }
        public string? Adresa { get; set; }
        public decimal? VenitLunar { get; set; }
    }

    public class UpdateProfilJuridicDto
    {
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string? Denumire { get; set; }
        public string? Adresa { get; set; }
        public decimal? VenitLunar { get; set; }
    }
}
