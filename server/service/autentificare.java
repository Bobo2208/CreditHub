package ro.credithub.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.credithub.dto.LoginRequest;
import ro.credithub.dto.LoginResponse;
import ro.credithub.dto.RegisterClientRequest;
import ro.credithub.model.Broker;
import ro.credithub.model.Client;
import ro.credithub.model.ClientPersoanaFizica;
import ro.credithub.model.ClientPersoanaJuridica;
import ro.credithub.repository.BrokerRepository;
import ro.credithub.repository.ClientPersoanaFizicaRepository;
import ro.credithub.repository.ClientPersoanaJuridicaRepository;
import ro.credithub.security.JwtUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClientPersoanaFizicaRepository clientPersoanaFizicaRepository;
    private final ClientPersoanaJuridicaRepository clientPersoanaJuridicaRepository;
    private final BrokerRepository brokerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final LogService logService;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getParola())
        );

        String jwt = jwtUtils.generateJwtToken(authentication);
        
        String tip;
        String nume;
        Long id;
        
        if (loginRequest.isEsteBroker()) {
            Broker broker = brokerRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("Broker nu a fost găsit"));
            tip = "BROKER";
            nume = broker.getNume() + " " + broker.getPrenume();
            id = broker.getId();
        } else {
            // Verifică dacă e persoană fizică
            ClientPersoanaFizica clientFizic = clientPersoanaFizicaRepository.findByEmail(loginRequest.getEmail())
                    .orElse(null);
            
            if (clientFizic != null) {
                tip = "CLIENT_FIZIC";
                nume = clientFizic.getNume() + " " + clientFizic.getPrenume();
                id = clientFizic.getId();
                logService.logAction(clientFizic, "Autentificare în sistem");
            } else {
                // Verifică dacă e persoană juridică
                ClientPersoanaJuridica clientJuridic = clientPersoanaJuridicaRepository.findByEmail(loginRequest.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("Client nu a fost găsit"));
                
                tip = "CLIENT_JURIDIC";
                nume = clientJuridic.getDenumire();
                id = clientJuridic.getId();
                logService.logAction(clientJuridic, "Autentificare în sistem");
            }
        }
        
        return new LoginResponse(jwt, tip, nume, loginRequest.getEmail(), id);
    }

    @Transactional
    public void registerClient(RegisterClientRequest request) {
        // Verificare dacă emailul există deja
        if (clientPersoanaFizicaRepository.existsByEmail(request.getEmail()) || 
            clientPersoanaJuridicaRepository.existsByEmail(request.getEmail()) ||
            brokerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Emailul este deja folosit");
        }

        if (request.isPersoanaJuridica()) {
            // Verificare CUI unic
            if (clientPersoanaJuridicaRepository.existsByCui(request.getCui())) {
                throw new RuntimeException("CUI-ul este deja înregistrat");
            }
            
            ClientPersoanaJuridica client = new ClientPersoanaJuridica();
            client.setTip(Client.TipClient.juridic);
            client.setDenumire(request.getDenumire());
            client.setEmail(request.getEmail());
            client.setParolaHash(passwordEncoder.encode(request.getParola()));
            client.setCui(request.getCui());
            client.setAdresa(request.getAdresa());
            client.setTelefon(request.getTelefon());
            
            clientPersoanaJuridicaRepository.save(client);
            logService.logAction(client, "Înregistrare cont nou persoană juridică");
        } else {
            // Verificare CNP unic
            if (clientPersoanaFizicaRepository.existsByCnp(request.getCnp())) {
                throw new RuntimeException("CNP-ul este deja înregistrat");
            }
            
            ClientPersoanaFizica client = new ClientPersoanaFizica();
            client.setTip(Client.TipClient.fizic);
            client.setNume(request.getNume());
            client.setPrenume(request.getPrenume());
            client.setEmail(request.getEmail());
            client.setParolaHash(passwordEncoder.encode(request.getParola()));
            client.setCnp(request.getCnp());
            client.setDataNastere(LocalDate.parse(request.getDataNastere(), DateTimeFormatter.ISO_DATE));
            client.setAdresa(request.getAdresa());
            client.setTelefon(request.getTelefon());
            
            clientPersoanaFizicaRepository.save(client);
            logService.logAction(client, "Înregistrare cont nou persoană fizică");
        }
    }
}