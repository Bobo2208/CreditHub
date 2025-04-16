package ro.credithub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.credithub.model.Client;
import ro.credithub.model.ClientPersoanaFizica;
import ro.credithub.model.ClientPersoanaJuridica;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}

@Repository
public interface ClientPersoanaFizicaRepository extends JpaRepository<ClientPersoanaFizica, Long> {
    Optional<ClientPersoanaFizica> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCnp(String cnp);
}

@Repository
public interface ClientPersoanaJuridicaRepository extends JpaRepository<ClientPersoanaJuridica, Long> {
    Optional<ClientPersoanaJuridica> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCui(String cui);
}

@Repository
public interface BrokerRepository extends JpaRepository<Broker, Long> {
    Optional<Broker> findByEmail(String email);
    boolean existsByEmail(String email);
}

@Repository
public interface TipCreditRepository extends JpaRepository<TipCredit, Long> {
    Optional<TipCredit> findByNumeCredit(String numeCredit);
}

@Repository
public interface CerereCreditRepository extends JpaRepository<CerereCredit, Long> {
    List<CerereCredit> findByClientId(Long clientId);
    List<CerereCredit> findByBrokerId(Long brokerId);
    List<CerereCredit> findByStatus(CerereCredit.StatusCerere status);
}

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByClientId(Long clientId);
    List<Credit> findByStatus(Credit.StatusCredit status);
}

@Repository
public interface PlataRepository extends JpaRepository<Plata, Long> {
    List<Plata> findByCreditId(Long creditId);
    List<Plata> findByStatus(Plata.StatusPlata status);
}

@Repository
public interface NotificareRepository extends JpaRepository<Notificare, Long> {
    List<Notificare> findByClientId(Long clientId);
    List<Notificare> findByTip(Notificare.TipNotificare tip);
}

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByClientId(Long clientId);
}

@Repository
public interface LogActiuneRepository extends JpaRepository<LogActiune, Long> {
    List<LogActiune> findByClientId(Long clientId);
}