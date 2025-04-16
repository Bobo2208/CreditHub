package ro.credithub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tipuri_credite")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipCredit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tip_credit")
    private Long id;
    
    @Column(name = "nume_credit")
    private String numeCredit;
    
    @Column(name = "suma_minima")
    private BigDecimal sumaMinima;
    
    @Column(name = "suma_maxima")
    private BigDecimal sumaMaxima;
    
    @Column(name = "dobanda_minima")
    private BigDecimal dobandaMinima;
    
    @Column(name = "dobanda_maxima")
    private BigDecimal dobandaMaxima;
}

@Entity
@Table(name = "cereri_credit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CerereCredit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cerere")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "id_broker")
    private Broker broker;
    
    @Column(name = "suma_solicitata")
    private BigDecimal sumaSolicitata;
    
    @Column(name = "perioada_luni")
    private Integer perioadaLuni;
    
    @Column(name = "dobanda")
    private BigDecimal dobanda;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusCerere status = StatusCerere.in_asteptare;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public enum StatusCerere {
        in_asteptare, aprobata, respinsa
    }
}

@Entity
@Table(name = "credite")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_credit")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "id_broker")
    private Broker broker;
    
    @ManyToOne
    @JoinColumn(name = "id_tip_credit")
    private TipCredit tipCredit;
    
    @Column(name = "suma")
    private BigDecimal suma;
    
    @Column(name = "dobanda")
    private BigDecimal dobanda;
    
    @Column(name = "durata")
    private Integer durata;
    
    @Column(name = "rata")
    private BigDecimal rata;
    
    @Column(name = "data_start")
    private LocalDate dataStart;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusCredit status = StatusCredit.activ;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public enum StatusCredit {
        activ, inchis, intarziat
    }
}

@Entity
@Table(name = "plati")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plata")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_credit")
    private Credit credit;
    
    @Column(name = "suma_platita")
    private BigDecimal sumaPlatita;
    
    @Column(name = "data_plata")
    private LocalDate dataPlata;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusPlata status = StatusPlata.neplatita;
    
    public enum StatusPlata {
        neplatita, platita, intarziata
    }
}