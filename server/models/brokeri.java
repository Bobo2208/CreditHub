package ro.credithub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "brokeri")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Broker {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_broker")
    private Long id;
    
    @Column(name = "nume")
    private String nume;
    
    @Column(name = "prenume")
    private String prenume;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "parola_hash")
    private String parolaHash;
    
    @Column(name = "telefon")
    private String telefon;
}