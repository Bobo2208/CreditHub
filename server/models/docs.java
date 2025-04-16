package ro.credithub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificari")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notificare {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificare")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tip")
    private TipNotificare tip;
    
    @Column(name = "mesaj")
    private String mesaj;
    
    @CreationTimestamp
    @Column(name = "data_notificare")
    private LocalDateTime dataNotificare;
    
    public enum TipNotificare {
        scadenta, informativa, urgenta
    }
}

@Entity
@Table(name = "documente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_document")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    
    @Column(name = "tip_document")
    private String tipDocument;
    
    @Column(name = "fisier_path")
    private String fisierPath;
    
    @CreationTimestamp
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
}

@Entity
@Table(name = "log_actiuni")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogActiune {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    
    @Column(name = "actiune")
    private String actiune;
    
    @CreationTimestamp
    @Column(name = "data_actiune")
    private LocalDateTime dataActiune;
}