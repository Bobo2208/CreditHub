using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    [HttpPost]
    public IActionResult SendEmail([FromBody] ContactFormDto dto)
    {
        try
        {
            var message = new MimeMessage();

            
            message.From.Add(new MailboxAddress("CreditHub Contact", "site@credithub.ro"));

          
            message.To.Add(new MailboxAddress("Admin", "andronicbogdan22@stud.ase.ro"));

            
            message.ReplyTo.Add(new MailboxAddress(dto.Nume, dto.Email));

          
            message.Subject = $"Mesaj de contact de la {dto.Nume} - {dto.Subiect}";

            
            message.Body = new TextPart("plain")
            {
                Text = $"Email: {dto.Email}\nTelefon: {dto.Telefon}\n\nMesaj:\n{dto.Mesaj}"
            };

            using var client = new SmtpClient();
            client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            client.Authenticate("suntunemaildetest1234@gmail.com", "sfzq lyjm ezon mpng"); // 🔐
            client.Send(message);
            client.Disconnect(true);

            return Ok("Mesajul a fost trimis cu succes.");
        }
        catch (Exception)
        {
            return StatusCode(500, $"Eroare la trimiterea mesajului: ");
        }
    }
}
