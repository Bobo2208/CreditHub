// [ApiController]
// [Route("api/[controller]")]

// public class ClientiController : ControllerBase
// {
//     private readonly AppDbContext _context;

//     public ClientiController(AppDbContext context)
//     {
//         _context = context;
//     }

//     [HttpGet]
//     public async Task<IActionResult> GetClienti()
//     {
//         var clienti = await _context.Clienti.ToListAsync();
//         return Ok(clienti);
//     }

// }