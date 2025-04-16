package ro.credithub.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.credithub.model.Broker;
import ro.credithub.model.ClientPersoanaFizica;
import ro.credithub.model.ClientPersoanaJuridica;
import ro.credithub.repository.BrokerRepository;
import ro.credithub.repository.ClientPersoanaFizicaRepository;
import ro.credithub.repository.ClientPersoanaJuridicaRepository;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final ClientPersoanaFizicaRepository clientPersoanaFizicaRepository;
    private final ClientPersoanaJuridicaRepository clientPersoanaJuridicaRepository;
    private final BrokerRepository brokerRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Verificare client persoană fizică
        ClientPersoanaFizica clientFizic = clientPersoanaFizicaRepository.findByEmail(email).orElse(null);
        if (clientFizic != null) {
            return UserDetailsImpl.build(
                    clientFizic.getEmail(),
                    clientFizic.getParolaHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT_FIZIC"))
            );
        }
        
        // Verificare client persoană juridică
        ClientPersoanaJuridica clientJuridic = clientPersoanaJuridicaRepository.findByEmail(email).orElse(null);
        if (clientJuridic != null) {
            return UserDetailsImpl.build(
                    clientJuridic.getEmail(),
                    clientJuridic.getParolaHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT_JURIDIC"))
            );
        }
        
        // Verificare broker
        Broker broker = brokerRepository.findByEmail(email).orElse(null);
        if (broker != null) {
            return UserDetailsImpl.build(
                    broker.getEmail(),
                    broker.getParolaHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_BROKER"))
            );
        }
        
        throw new UsernameNotFoundException("Utilizator cu email-ul " + email + " nu a fost găsit");
    }
}