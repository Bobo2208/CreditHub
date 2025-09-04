// BrokerController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Text.Json;

namespace Incercare.Controllers
{
    [ApiController]
    [Route("api")]
    public class BrokerController : ControllerBase
    {
        private readonly LicentaContext _context;
        private readonly IConfiguration _config;

        public BrokerController(LicentaContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public class RejectPayload
        {
            public List<string> Reasons { get; set; } = new List<string>();
            public string? Comment { get; set; }
        }

        [HttpGet("broker/me")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> GetBroker([FromQuery] int id)
        {
            var broker = await _context.Brokeris.FindAsync(id);
            if (broker == null) return NotFound();
            return Ok(new { broker.Nume, broker.Prenume, broker.Email, broker.Telefon });
        }

        [HttpGet("broker/dashboard-stats")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _context.CereriCredits.CountAsync();
            var asteptare = await _context.CereriCredits.CountAsync(c => c.Status == "in_asteptare");
            var aprobate = await _context.CereriCredits.CountAsync(c => c.Status == "aprobata");
            var respinse = await _context.CereriCredits.CountAsync(c => c.Status == "respinsa");

            return Ok(new
            {
                totalCereri = total,
                cereriAsteptare = asteptare,
                cereriAprobate = aprobate,
                cereriRespinse = respinse
            });
        }

        [HttpGet("cereri/all")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> GetToateCererile()
        {
            var cereri = await _context.CereriCredits
                .Include(c => c.IdClientNavigation)
                    .ThenInclude(c => c.ClientiPersoaneFizice)
                .Include(c => c.IdClientNavigation)
                    .ThenInclude(c => c.ClientiPersoaneJuridice)
                .Include(c => c.IdTipCreditNavigation)
                .Select(c => new
                {
                    c.IdCerere,
                    c.IdClient,
                    numeClient = c.IdClientNavigation.ClientiPersoaneFizice != null
                        ? c.IdClientNavigation.ClientiPersoaneFizice.Nume + " " + c.IdClientNavigation.ClientiPersoaneFizice.Prenume
                        : c.IdClientNavigation.ClientiPersoaneJuridice.Denumire,
                    c.SumaSolicitata,
                    tipCredit = c.IdTipCreditNavigation.NumeCredit,
                    c.Status
                })
                .ToListAsync();
            return Ok(cereri);
        }

        [HttpPost("cereri/aproba/{id}")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> AprobaCerere(int id)
        {
            var cerere = await _context.CereriCredits.FindAsync(id);
            if (cerere == null) return NotFound();
            cerere.Status = "aprobata";
            cerere.Dobanda = 6.5m;
            await _context.SaveChangesAsync();

            var existaCredit = await _context.Credites.AnyAsync(c =>
                c.IdClient == cerere.IdClient
                && c.IdTipCredit == cerere.IdTipCredit
                && c.Suma == cerere.SumaSolicitata);

            if (!existaCredit)
            {
                var rata = cerere.SumaSolicitata.HasValue && cerere.PerioadaLuni.HasValue && cerere.PerioadaLuni.Value > 0
                    ? Math.Round(cerere.SumaSolicitata.Value / cerere.PerioadaLuni.Value, 2)
                    : 0m;

                var credit = new Credite
                {
                    IdClient = cerere.IdClient,
                    IdBroker = cerere.IdBroker,
                    IdTipCredit = cerere.IdTipCredit,
                    Suma = cerere.SumaSolicitata,
                    Dobanda = cerere.Dobanda,
                    Durata = cerere.PerioadaLuni,
                    Rata = rata,
                    Status = "activ",
                    DataStart = DateOnly.FromDateTime(DateTime.Now),
                    CreatedAt = DateTime.Now
                };
                _context.Credites.Add(credit);
                await _context.SaveChangesAsync();
            }

            return Ok(new { mesaj = "Cererea a fost aprobată." });
        }

        [HttpPost("cereri/respinge/{id}")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> RespingeCerere(int id, [FromBody] RejectPayload payload)
        {
            var cerere = await _context.CereriCredits.FindAsync(id);
            if (cerere == null) return NotFound();
            cerere.Status = "respinsa";
            
            var obj = new { reasons = payload.Reasons, comment = payload.Comment };
            cerere.Comentarii = JsonSerializer.Serialize(obj);
            
            await _context.SaveChangesAsync();
            return Ok(new { mesaj = "Cererea a fost respinsă." });
        }

        [HttpGet("documente/client/{id}")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> GetDocumente(int id)
        {
            var documente = await _context.Documentes
                .Where(d => d.IdClient == id)
                .Select(d => new { d.TipDocument, d.FisierPath })
                .ToListAsync();
            return Ok(documente);
        }

        [HttpGet("credite/active/{clientId}")]
        [Authorize(Roles = "broker")]
        public async Task<IActionResult> GetCrediteActiveClient(int clientId)
        {
            var credite = await _context.Credites
                .Include(c => c.IdTipCreditNavigation)
                .Where(c => c.IdClient == clientId && c.Status == "activ")
                .OrderByDescending(c => c.DataStart)
                .Select(c => new
                {
                    c.IdCredit,
                    c.Suma,
                    c.Rata,
                    c.Dobanda,
                    c.Durata,
                    c.DataStart,
                    c.Status,
                    NumeCredit = c.IdTipCreditNavigation.NumeCredit
                })
                .ToListAsync();
            return Ok(credite);
        }

    [HttpPost("broker/request")]
    [AllowAnonymous]
    public async Task<IActionResult> RequestBrokerAccount([FromBody] BrokerRegisterDto dto)
    {
        if (await _context.Brokeris.AnyAsync(b => b.Email == dto.Email) ||
            await _context.PendingBrokers.AnyAsync(p => p.Email == dto.Email))
        {
            return BadRequest("Există deja un cont sau o cerere cu acest email.");
        }

        var token = Guid.NewGuid().ToString("N");
        var parolaHash = BCrypt.Net.BCrypt.HashPassword(dto.Parola);

        var pending = new PendingBroker
        {
            Nume = dto.Nume,
            Prenume = dto.Prenume,
            Email = dto.Email,
            ParolaHash = parolaHash,
            Token = token
        };

        _context.PendingBrokers.Add(pending);
        await _context.SaveChangesAsync();

        var approvalLink = $"http://localhost:5000/api/broker/approve?token={token}";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("CreditHub", "site@credithub.ro"));
        message.To.Add(new MailboxAddress("Admin Bancă", "andronicbogdan22@stud.ase.ro"));
        message.Subject = $"Cerere nouă cont broker: {dto.Nume} {dto.Prenume}";
        message.Body = new TextPart("plain")
        {
            Text = $"Salut,\n\nBrokerul {dto.Nume} {dto.Prenume} ({dto.Email}) a solicitat un cont.\n\nAprobă aici: {approvalLink}\n\nDacă nu recunoști cererea, ignoră acest email."
        };

        using var client = new SmtpClient();
        client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        client.Authenticate("suntunemaildetest1234@gmail.com", "sfzq lyjm ezon mpng");
        await client.SendAsync(message);
        client.Disconnect(true);

        return Ok("Cererea a fost trimisă către bancă.");
    }

    [HttpGet("broker/approve")]
    [AllowAnonymous]
    public async Task<IActionResult> ApproveBroker([FromQuery] string token)
    {
        var pending = await _context.PendingBrokers.FirstOrDefaultAsync(p => p.Token == token);
        if (pending == null) return NotFound("Token invalid sau expirat.");

        var broker = new Brokeri
        {
            Nume = pending.Nume,
            Prenume = pending.Prenume,
            Email = pending.Email,
            ParolaHash = pending.ParolaHash
        };

        _context.Brokeris.Add(broker);
        _context.PendingBrokers.Remove(pending);
        await _context.SaveChangesAsync();

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("CreditHub", "site@credithub.ro"));
        message.To.Add(new MailboxAddress($"{broker.Nume} {broker.Prenume}", broker.Email));
        message.Subject = "Contul tău de broker a fost aprobat!";
        message.Body = new TextPart("plain")
        {
            Text = $"Salut, {broker.Nume} {broker.Prenume}!\n\nContul tău de broker a fost aprobat. Poți să te autentifici acum în platformă.\n\nSucces!"
        };

        using var client = new SmtpClient();
        client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        client.Authenticate("suntunemaildetest1234@gmail.com", "sfzq lyjm ezon mpng");
        await client.SendAsync(message);
        client.Disconnect(true);

        return Content("Contul brokerului a fost aprobat cu succes.", "text/plain");
    }
    }
}
