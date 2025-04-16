package ro.credithub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clienti")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Client {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tip", nullable = false)
    private TipClient tip;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum TipClient {
        fizic, juridic
    }
}

@Entity
@Table(name = "clienti_persoane_fizice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientPersoanaFizica extends Client {
    
    @Column(name = "nume")
    private String nume;
    
    @Column(name = "prenume")
    private String prenume;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "parola_hash")
    private String parolaHash;
    
    @Column(name = "cnp", unique = true)
    private String cnp;
    
    @Column(name = "data_nastere")
    private LocalDate dataNastere;
    
    @Column(name = "adresa")
    private String adresa;
    
    @Column(name = "telefon")
    private String telefon;
}

@Entity
@Table(name = "clienti_persoane_juridice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientPersoanaJuridica extends Client {
    
    @Column(name = "denumire")
    private String denumire;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "parola_hash")
    private String parolaHash;
    
    @Column(name = "cui", unique = true)
    private String cui;
    
    @Column(name = "adresa")
    private String adresa;
    
    @Column(name = "telefon")
    private String telefon;
}