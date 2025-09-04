using Microsoft.AspNetCore.Mvc;
using Incercare;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LicentaContext _context;
    private readonly JwtService _jwtService;

    public AuthController(LicentaContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto login)
    {
        var broker = _context.Brokeris.FirstOrDefault(b => b.Email == login.Email);
        if (broker != null)
        {
            return Unauthorized(new { message = "Aceasta este autentificare doar de client" });
        }

        var clientFizic = _context.ClientiPersoaneFizices
            .FirstOrDefault(c => c.Email == login.Email);

        if (clientFizic != null && PasswordHelper.VerifyPassword(login.Parola, clientFizic.ParolaHash))
        {
            var token = _jwtService.GenerateToken(clientFizic.IdClient, "fizic");
            return Ok(new
            {
                token,
                role = "fizic",
                id = clientFizic.IdClient,
                nume = clientFizic.Nume,
                prenume = clientFizic.Prenume,
                venit_lunar = clientFizic.VenitLunar
            });
        }

        var clientJuridic = _context.ClientiPersoaneJuridices
            .FirstOrDefault(c => c.Email == login.Email);

        if (clientJuridic != null && PasswordHelper.VerifyPassword(login.Parola, clientJuridic.ParolaHash))
        {
            var token = _jwtService.GenerateToken(clientJuridic.IdClient, "juridic");
            return Ok(new
            {
                token,
                role = "juridic",
                id = clientJuridic.IdClient,
                nume = clientJuridic.Nume,
                prenume = clientJuridic.Prenume,
                venit_lunar = clientJuridic.VenitLunar
            });
        }

        return Unauthorized(new { message = "Email sau parolă incorectă" });
    }


    [HttpPost("broker-login")]
    public IActionResult BrokerLogin([FromBody] LoginDto login)
    {
        var broker = _context.Brokeris
            .FirstOrDefault(b => b.Email == login.Email);

        if (broker == null || !PasswordHelper.VerifyPassword(login.Parola, broker.ParolaHash))
        {
            return Unauthorized(new { message = "Email sau parolă incorectă." });
        }

        var token = _jwtService.GenerateToken(broker.IdBroker, "broker");

        return Ok(new
        {
            token,
            role = "broker",
            id = broker.IdBroker,
            nume = broker.Nume,
            prenume = broker.Prenume,
            venit_lunar = (decimal?)null
        });
    }




    [HttpPost("reset-password")]
    public IActionResult ResetPassword([FromBody] ResetPasswordRequestDto dto)
    {
        var clientFizic = _context.ClientiPersoaneFizices.FirstOrDefault(c => c.Email == dto.Email);
        if (clientFizic != null)
        {
            var token = Guid.NewGuid().ToString();
            clientFizic.TokenResetare = token;
            clientFizic.TokenExpira = DateTime.UtcNow.AddHours(1);
            _context.SaveChanges();

            EmailService.TrimiteEmailResetParola(dto.Email, token);

            return Ok("Verifică adresa ta de email pentru resetarea parolei.");
        }

        var clientJuridic = _context.ClientiPersoaneJuridices.FirstOrDefault(c => c.Email == dto.Email);
        if (clientJuridic != null)
        {
            var token = Guid.NewGuid().ToString();
            clientJuridic.TokenResetare = token;
            clientJuridic.TokenExpira = DateTime.UtcNow.AddHours(1);
            _context.SaveChanges();

            EmailService.TrimiteEmailResetParola(dto.Email, token);

            return Ok("Verifică adresa ta de email pentru resetarea parolei.");
        }

        var broker = _context.Brokeris.FirstOrDefault(b => b.Email == dto.Email);
        if (broker != null)
        {
            var token = Guid.NewGuid().ToString();
            broker.TokenResetare = token;
            broker.TokenExpira = DateTime.UtcNow.AddHours(1);
            _context.SaveChanges();

            EmailService.TrimiteEmailResetParola(dto.Email, token);

            return Ok("Verifică adresa ta de email pentru resetarea parolei.");
        }

        return Ok("Dacă adresa este corectă, vei primi un email cu instrucțiuni.");
    }

    [HttpPost("set-new-password")]
    public IActionResult SetNewPassword([FromBody] SetNewPasswordDto dto)
    {
        var clientFizic = _context.ClientiPersoaneFizices.FirstOrDefault(c =>
            c.Email == dto.Email && c.TokenResetare == dto.Token && c.TokenExpira > DateTime.UtcNow);
        if (clientFizic != null)
        {
            clientFizic.ParolaHash = PasswordHelper.HashPassword(dto.NewPassword);
            clientFizic.TokenResetare = null;
            clientFizic.TokenExpira = null;
            _context.SaveChanges();
            return Ok("Parola a fost resetată cu succes.");
        }

        var clientJuridic = _context.ClientiPersoaneJuridices.FirstOrDefault(c =>
            c.Email == dto.Email && c.TokenResetare == dto.Token && c.TokenExpira > DateTime.UtcNow);
        if (clientJuridic != null)
        {
            clientJuridic.ParolaHash = PasswordHelper.HashPassword(dto.NewPassword);
            clientJuridic.TokenResetare = null;
            clientJuridic.TokenExpira = null;
            _context.SaveChanges();
            return Ok("Parola a fost resetată cu succes.");
        }

        var broker = _context.Brokeris.FirstOrDefault(b =>
            b.Email == dto.Email && b.TokenResetare == dto.Token && b.TokenExpira > DateTime.UtcNow);
        if (broker != null)
        {
            broker.ParolaHash = PasswordHelper.HashPassword(dto.NewPassword);
            broker.TokenResetare = null;
            broker.TokenExpira = null;
            _context.SaveChanges();
            return Ok("Parola a fost resetată cu succes.");
        }

        return BadRequest("Token invalid sau expirat.");
    }
}
