using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

public class EmailService
{
    public static void TrimiteEmailResetParola(string destinatar, string token)
    {
        var mesaj = new MimeMessage();
        mesaj.From.Add(new MailboxAddress("CreditHub", "site@credithub.ro"));
        mesaj.To.Add(MailboxAddress.Parse(destinatar));
        mesaj.Subject = "Resetare parolă - CreditHub";

        string linkReset = $"http://localhost:3000/setare-parola?email={Uri.EscapeDataString(destinatar)}&token={Uri.EscapeDataString(token)}";

        mesaj.Body = new TextPart("plain")
        {
            Text = $@"Ai cerut resetarea parolei pentru contul tău CreditHub.
Folosește linkul de mai jos pentru a seta o parolă nouă (valabil 1 oră):

{linkReset}

Dacă nu ai solicitat această acțiune, poți ignora acest mesaj."
        };

        using var client = new SmtpClient();
        client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        client.Authenticate("suntunemaildetest1234@gmail.com", "sfzq lyjm ezon mpng"); // App password
        client.Send(mesaj);
        client.Disconnect(true);
    }
}
