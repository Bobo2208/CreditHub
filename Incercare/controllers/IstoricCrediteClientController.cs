using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Incercare.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IstoricCrediteController : ControllerBase
    {
        private readonly LicentaContext _context;

        public IstoricCrediteController(LicentaContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("client")]
        public IActionResult GetCrediteClient()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized();

                var clientId = int.Parse(userId);

                var credite = _context.Credites
                    .Include(c => c.IdTipCreditNavigation)
                    .Where(c => c.IdClient == clientId)
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
                    .ToList();

                return Ok(credite);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Eroare server: {ex.Message}" });
            }
        }
    }
}
