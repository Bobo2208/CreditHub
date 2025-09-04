using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/[controller]")]
public class DocumenteController : ControllerBase
{
    private readonly Incercare.LicentaContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<DocumenteController> _logger;

    public DocumenteController(Incercare.LicentaContext context, IWebHostEnvironment env, ILogger<DocumenteController> logger)
    {
        _context = context;
        _env = env;
        _logger = logger;
    }

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        try
        {
            _logger.LogInformation("🔥 Upload started");
            
            
            _logger.LogInformation($"Content-Type: {Request.ContentType}");
            _logger.LogInformation($"Request.Form.Count: {Request.Form.Count}");
            _logger.LogInformation($"Request.Form.Files.Count: {Request.Form.Files.Count}");
            
            if (Request.Form.Files.Count > 0)
            {
                foreach (var formFile in Request.Form.Files)
                {
                    _logger.LogInformation($"Form file: {formFile.Name} - {formFile.FileName} - {formFile.Length} bytes");
                }
            }

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("❌ No file received");
                return BadRequest(new { message = "Niciun fișier primit." });
            }

            _logger.LogInformation($"📁 File received: {file.FileName} ({file.Length} bytes)");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                _logger.LogWarning("❌ Unauthorized - no user ID");
                return Unauthorized(new { message = "Neautorizat." });
            }

            _logger.LogInformation($"👤 User ID: {userId}");

            var clientId = int.Parse(userId);
            
            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            
            _logger.LogInformation($"📄 File extension: {fileExtension}");
            
            if (!allowedExtensions.Contains(fileExtension))
            {
                _logger.LogWarning($"❌ Invalid file extension: {fileExtension}");
                return BadRequest(new { message = "Tip de fișier neacceptat. Doar PDF, JPG, PNG, DOC, DOCX sunt permise." });
            }

            if (file.Length > 10 * 1024 * 1024)
            {
                _logger.LogWarning($"❌ File too large: {file.Length} bytes");
                return BadRequest(new { message = "Fișierul este prea mare. Dimensiunea maximă este 10MB." });
            }

            var dir = Path.Combine(_env.ContentRootPath, "uploads", clientId.ToString());
            _logger.LogInformation($"📂 Upload directory: {dir}");
            
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
                _logger.LogInformation($"📂 Created directory: {dir}");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var path = Path.Combine(dir, uniqueFileName);
            
            _logger.LogInformation($"💾 Saving file to: {path}");
            
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            _logger.LogInformation("✅ File saved successfully");

            var tipDocument = DetecteazaTipDocument(file.FileName);
            _logger.LogInformation($"🔍 Detected document type: {tipDocument}");

            var doc = new Incercare.Documente
            {
                IdClient = clientId,
                TipDocument = tipDocument,
                FisierPath = Path.Combine("uploads", clientId.ToString(), uniqueFileName).Replace("\\", "/"),
                UploadDate = DateTime.Now
            };
            
            _context.Documentes.Add(doc);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation($"✅ Document saved to database with ID: {doc.IdDocument}");

            return Ok(new { 
                message = "Fișier încărcat cu succes!",
                tipDocument = tipDocument,
                fileName = file.FileName,
                fileSize = file.Length,
                documentId = doc.IdDocument
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error during file upload");
            return StatusCode(500, new { message = $"Eroare server: {ex.Message}" });
        }
    }

    [Authorize]
    [HttpGet("lista")]
    public IActionResult Lista()
    {
        try
        {
            _logger.LogInformation("📋 Getting documents list");
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                _logger.LogWarning("❌ Unauthorized - no user ID");
                return Unauthorized();
            }

            var clientId = int.Parse(userId);
            _logger.LogInformation($"👤 Getting documents for client: {clientId}");

            var documente = _context.Documentes
                .Where(d => d.IdClient == clientId)
                .Select(d => new
                {
                    d.IdDocument,
                    d.TipDocument,
                    d.FisierPath,
                    d.UploadDate,
                    NumeFisier = Path.GetFileName(d.FisierPath)
                })
                .OrderByDescending(d => d.UploadDate)
                .ToList();

            _logger.LogInformation($"📋 Found {documente.Count} documents");
            return Ok(documente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error getting documents list");
            return StatusCode(500, new { message = $"Eroare server: {ex.Message}" });
        }
    }

    [Authorize]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            _logger.LogInformation($"🗑️ Deleting document ID: {id}");
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var clientId = int.Parse(userId);
            
            var doc = await _context.Documentes.FindAsync(id);
            if (doc == null || doc.IdClient != clientId) 
            {
                _logger.LogWarning($"❌ Document not found or access denied. ID: {id}, ClientId: {clientId}");
                return ForbidWithMessage(new { message = "Nu aveți permisiunea..." });

            }

            var fullPath = Path.Combine(_env.ContentRootPath, doc.FisierPath);
            _logger.LogInformation($"🗑️ Deleting file: {fullPath}");
            
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
                _logger.LogInformation("✅ File deleted from disk");
            }
            else
            {
                _logger.LogWarning($"⚠️ File not found on disk: {fullPath}");
            }

            _context.Documentes.Remove(doc);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("✅ Document deleted from database");
            return Ok(new { message = "Document șters cu succes." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error deleting document ID: {id}");
            return StatusCode(500, new { message = $"Eroare server: {ex.Message}" });
        }
    }

    private IActionResult ForbidWithMessage(object value)
    {
        return StatusCode(403, value);
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        try
        {
            _logger.LogInformation("🧪 Test endpoint called");
            var dbConnection = _context.Database.CanConnect();
            return Ok(new { 
                message = "Server is running",
                timestamp = DateTime.Now,
                databaseConnected = dbConnection,
                environment = _env.EnvironmentName
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Test endpoint error");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    private string DetecteazaTipDocument(string fileName)
    {
        var numeFisier = fileName.ToLower();

        if (Regex.IsMatch(numeFisier, @"buletin|carte.*identitate|ci|id"))
            return "Buletin";
        
        if (Regex.IsMatch(numeFisier, @"adeverinta.*venit|salariu|venit|adeverinta.*salariat"))
            return "Adeverinta Venit";
        
        if (Regex.IsMatch(numeFisier, @"cerere.*credit|aplicatie.*credit|formular.*credit"))
            return "Cerere Credit";
        
        if (Regex.IsMatch(numeFisier, @"extras.*cont|iban|cont.*bancar"))
            return "Extras Cont";
        
        if (Regex.IsMatch(numeFisier, @"contract.*munca|cim"))
            return "Contract Munca";

        return "Altele";
    }
}