public class RegisterFizicDto
{
    public string Nume { get; set; } = string.Empty;
    public string Prenume { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Parola { get; set; } = string.Empty;
    public string Cnp { get; set; } = string.Empty;
    public string Adresa { get; set; } = string.Empty;
    public DateTime DataNastere { get; set; }
}

public class RegisterJuridicDto
{
    public string Denumire { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Parola { get; set; } = string.Empty;
    public string Cui { get; set; } = string.Empty;
    public string Adresa { get; set; } = string.Empty;
    public string Nume { get; set; } = string.Empty;
    public string Prenume { get; set; } = string.Empty;
}
