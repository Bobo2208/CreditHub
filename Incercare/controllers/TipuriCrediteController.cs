// using Microsoft.AspNetCore.Mvc;
// using Incercare;
// using Microsoft.AspNetCore.Authorization;

// [ApiController]
//     [Route("api/[controller]")]
//     public class TipuriCrediteController : ControllerBase
//     {
//         private readonly LicentaContext _context;

//         public TipuriCrediteController(LicentaContext context)
//         {
//             _context = context;
//         }

//         [HttpGet("by-client-type/{tipClient}")]
//         public IActionResult GetTipuriCrediteByTipClient(string tipClient)
//         {
//             try
//             {
//                 var tipNormalizat = tipClient.ToLower().Trim();

//                 if (tipNormalizat != "fizic" && tipNormalizat != "juridic")
//                 {
//                     return BadRequest("Tipul clientului trebuie să fie 'fizic' sau 'juridic'");
//                 }

//                 var tipuri = _context.TipuriCredites
//                     .Where(tc => tc.TipClient.ToLower().EndsWith(tipNormalizat))
//                     .Select(tc => new {
//                         IdTipCredit = tc.IdTipCredit,
//                         NumeCredit = tc.NumeCredit,
//                         SumaMinima = tc.SumaMinima,
//                         SumaMaxima = tc.SumaMaxima,
//                         DobandaMinima = tc.DobandaMinima,
//                         DobandaMaxima = tc.DobandaMaxima,
//                         TipClient = tc.TipClient,
//                         PerioadaMinima = tc.PerioadaMinima,
//                         PerioadaMaxima = tc.PerioadaMaxima
//                     })
//                     .ToList();

//                 return Ok(tipuri);
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Eroare: {ex.Message}");
//                 return StatusCode(500, "A apărut o eroare");
//             }
//         }
//     }

