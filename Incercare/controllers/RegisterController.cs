using Microsoft.AspNetCore.Mvc;
using Incercare;
using BCrypt.Net;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly LicentaContext _context;

    public RegisterController(LicentaContext context)
    {
        _context = context;
    }

    [HttpPost("fizic")]
    public IActionResult RegisterFizic([FromBody] RegisterFizicDto dto)
    {
        if (_context.ClientiPersoaneFizices.Any(c => c.Email == dto.Email))
            return BadRequest("Email deja folosit.");

        var client = new Clienti
        {
            TipClient = "fizic"
        };
        _context.Clientis.Add(client);
        _context.SaveChanges();

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Parola);

        var clientFizic = new ClientiPersoaneFizice
        {
            IdClient = client.IdClient,
            Nume = dto.Nume,
            Prenume = dto.Prenume,
            Email = dto.Email,
            Telefon = dto.Telefon,
            Cnp = dto.Cnp,
            Adresa = dto.Adresa,
            DataNastere = DateOnly.FromDateTime(dto.DataNastere),
            ParolaHash = hash
        };

        _context.ClientiPersoaneFizices.Add(clientFizic);
        _context.SaveChanges();

        return Ok("Client persoană fizică înregistrat cu succes.");
    }

    [HttpPost("juridic")]
    public IActionResult RegisterJuridic([FromBody] RegisterJuridicDto dto)
    {
        if (_context.ClientiPersoaneJuridices.Any(c => c.Email == dto.Email))
            return BadRequest("Email deja folosit.");

        var client = new Clienti
        {
            TipClient = "juridic"
        };
        _context.Clientis.Add(client);
        _context.SaveChanges();

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Parola);

        var clientJuridic = new ClientiPersoaneJuridice
        {
            IdClient = client.IdClient,
            Denumire = dto.Denumire,
            Email = dto.Email,
            Telefon = dto.Telefon,
            Cui = dto.Cui,
            Adresa = dto.Adresa,
            ParolaHash = hash,
            Nume = dto.Nume,
            Prenume = dto.Prenume
        };

        _context.ClientiPersoaneJuridices.Add(clientJuridic);
        _context.SaveChanges();

        return Ok("Client persoană juridică înregistrat cu succes.");
    }
}
