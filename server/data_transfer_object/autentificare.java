package ro.credithub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String parola;
    private boolean esteBroker;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tip;
    private String nume;
    private String email;
    private Long id;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterClientRequest {
    private String nume;
    private String prenume;
    private String email;
    private String parola;
    private String cnp;
    private String dataNastere;
    private String adresa;
    private String telefon;
    private boolean persoanaJuridica;
    
    // Câmpuri pentru persoane juridice
    private String denumire;
    private String cui;
}