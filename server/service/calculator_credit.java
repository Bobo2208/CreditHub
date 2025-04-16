package ro.credithub.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.credithub.dto.AplicaCreditRequest;
import ro.credithub.dto.AplicaCreditResponse;
import ro.credithub.dto.CalculatorCreditRequest;
import ro.credithub.dto.CalculatorCreditResponse;
import ro.credithub.dto.CerereConsultatieRequest;
import ro.credithub.dto.CerereConsultatieResponse;
import ro.credithub.model.*;
import ro.credithub.repository.BrokerRepository;
import ro.credithub.repository.CerereCreditRepository;
import ro.credithub.repository.ClientRepository;
import ro.credithub.repository.TipCreditRepository;
import ro.credithub.repository.NotificareRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CreditService {

    private final CerereCreditRepository cerereCreditRepository;
    private final ClientRepository clientRepository;
    private final BrokerRepository brokerRepository;
    private final TipCreditRepository tipCreditRepository;
    private final NotificareRepository notificareRepository;
    private final EmailService emailService;
    private final LogService logService;
    
    // Rata dobânzii anuale standard în procente (9.49%)
    private static final BigDecimal DOBANDA_ANUALA_STANDARD = new BigDecimal("9.49");
    
    /**
     * Calculează rata lunară și suma totală pentru un credit în funcție de suma și perioada specificată
     */
    public CalculatorCreditResponse calculeazaCredit(CalculatorCreditRequest request) {
        BigDecimal suma = request.getSuma();
        Integer perioadaLuni = request.getPerioadaLuni();
        
        // Calculează rata lunară folosind formula de amortizare
        BigDecimal rataDobanziiLunare = DOBANDA_ANUALA_STANDARD.divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP)
                .divide(new BigDecimal("100"), 10, RoundingMode.HALF_UP);
        
        BigDecimal rataLunara;
        
        if (rataDobanziiLunare.compareTo(BigDecimal.ZERO) == 0) {
            rataLunara = suma.divide(new BigDecimal(perioadaLuni), 2, RoundingMode.HALF_UP);
        } else {
            // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
            BigDecimal rate = suma.multiply(rataDobanziiLunare)
                    .multiply(BigDecimal.ONE.add(rataDobanziiLunare).pow(perioadaLuni))
                    .divide(BigDecimal.ONE.add(rataDobanziiLunare).pow(perioadaLuni).subtract(BigDecimal.ONE), 
                            2, RoundingMode.HALF_UP);
            rataLunara = rate;
        }
        
        BigDecimal sumaTotala = rataLunara.multiply(new BigDecimal(perioadaLuni)).setScale(2, RoundingMode.HALF_UP);
        
        return new CalculatorCreditResponse(
                suma,
                perioadaLuni,
                DOBANDA_ANUALA_STANDARD,
                rataLunara,
                sumaTotala
        );
    }
    
    /**
     * Înregistrează o cerere de consultație pentru un posibil client
     */
    @Transactional
    public CerereConsultatieResponse cereConsultatie(CerereConsultatieRequest request) {
        // Trimite email de confirmare
        String subiect = "CreditHub - Solicitare de consultație";
        String mesaj = String.format(
                "Bună ziua %s %s,\n\n" +
                "Am primit solicitarea dumneavoastră de consultație pentru un credit de tip %s. " +
                "Un consultant CreditHub vă va contacta în cel mai scurt timp la numărul %s pentru a programa o întâlnire.\n\n" +
                "Cu stimă,\nEchipa CreditHub",
                request.getPrenume(), request.getNume(), request.getTipCredit(), request.getTelefon()
        );
        
        emailService.trimiteEmail(request.getEmail(), subiect, mesaj);
        
        // Notifică brokerul de serviciu (pentru demonstrație, alegem primul broker disponibil)
        List<Broker> brokeri = brokerRepository.findAll();
        if (!brokeri.isEmpty()) {
            Broker broker = brokeri.get(0);
            String subiectBroker = "CreditHub - Nouă solicitare de consultație";
            String mesajBroker = String.format(
                    "O nouă solicitare de consultație a fost înregistrată:\n\n" +
                    "Nume: %s %s\n" +
                    "Email: %s\n" +
                    "Telefon: %s\n" +
                    "Tip credit: %s\n\n" +
                    "Te rugăm să contactezi clientul în cel mai scurt timp.",
                    request.getPrenume(), request.getNume(), request.getEmail(), 
                    request.getTelefon(), request.getTipCredit()
            );
            
            emailService.trimiteEmail(broker.getEmail(), subiectBroker, mesajBroker);
        }
        
        return new CerereConsultatieResponse(
                new Random().nextLong(1000, 9999), // ID demonstrativ
                "Solicitarea dumneavoastră a fost înregistrată cu succes!",
                "in_asteptare"
        );
    }
    
    /**
     * Înregistrează o cerere de credit pentru un client autentificat
     */
    @Transactional
    public AplicaCreditResponse aplicaPentruCredit(Long clientId, AplicaCreditRequest request) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client inexistent"));
        
        // Alocă un broker disponibil pentru această cerere (pentru demonstrație, primul broker)
        List<Broker> brokeri = brokerRepository.findAll();
        if (brokeri.isEmpty()) {
            throw new RuntimeException("Nu există brokeri disponibili pentru procesarea cererii");
        }
        Broker broker = brokeri.get(0);
        
        // Crează cererea de credit
        CerereCredit cerereCredit = new CerereCredit();
        cerereCredit.setClient(client);
        cerereCredit.setBroker(broker);
        cerereCredit.setSumaSolicitata(request.getSuma());
        cerereCredit.setPerioadaLuni(request.getPerioadaLuni());
        cerereCredit.setDobanda(DOBANDA_ANUALA_STANDARD);
        cerereCredit.setStatus(CerereCredit.StatusCerere.in_asteptare);
        
        CerereCredit cerecreSalvata = cerereCreditRepository.save(cerereCredit);
        
        // Crează notificare pentru client
        Notificare notificare = new Notificare();
        notificare.setClient(client);
        notificare.setTip(Notificare.TipNotificare.informativa);
        notificare.setMesaj("Cererea dumneavoastră de credit în valoare de " + request.getSuma() + 
                " RON a fost înregistrată și este în curs de analiză.");
        notificareRepository.save(notificare);
        
        // Log acțiune
        logService.logAction(client, "A aplicat pentru un credit de tip " + request.getTipCredit() + 
                " în valoare de " + request.getSuma() + " RON");
        
        // Trimite email de confirmare către client
        String numeClient = "Client";
        if (client.getTip() == Client.TipClient.fizic) {
            ClientPersoanaFizica clientFizic = (ClientPersoanaFizica) client;
            numeClient = clientFizic.getNume() + " " + clientFizic.getPrenume();
            emailService.trimiteEmail(
                    clientFizic.getEmail(),
                    "CreditHub - Confirmare aplicare credit",
                    "Bună ziua " + numeClient + ",\n\n" +
                    "Cererea dumneavoastră de credit în valoare de " + request.getSuma() + 
                    " RON a fost înregistrată cu ID-ul #" + cerecreSalvata.getId() + ".\n" +
                    "Un consultant CreditHub vă va contacta în scurt timp pentru detalii suplimentare.\n\n" +
                    "Cu stimă,\nEchipa CreditHub"
            );
        } else if (client.getTip() == Client.TipClient.juridic) {
            ClientPersoanaJuridica clientJuridic = (ClientPersoanaJuridica) client;
            numeClient = clientJuridic.getDenumire();
            emailService.trimiteEmail(
                    clientJuridic.getEmail(),
                    "CreditHub - Confirmare aplicare credit",
                    "Bună ziua " + numeClient + ",\n\n" +
                    "Cererea dumneavoastră de credit în valoare de " + request.getSuma() + 
                    " RON a fost înregistrată cu ID-ul #" + cerecreSalvata.getId() + ".\n" +
                    "Un consultant CreditHub vă va contacta în scurt timp pentru detalii suplimentare.\n\n" +
                    "Cu stimă,\nEchipa CreditHub"
            );
        }
        
        return new AplicaCreditResponse(
                cerecreSalvata.getId(),
                "in_asteptare",
                "Cererea dumneavoastră de credit a fost înregistrată cu succes! Un consultant vă va contacta în curând."
        );
    }
    
    /**
     * Obține toate cererile de credit ale unui client
     */
    public List<CerereCredit> getCereriCreditClient(Long clientId) {
        return cerereCreditRepository.findByClientId(clientId);
    }
}