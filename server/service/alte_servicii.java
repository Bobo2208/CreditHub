package ro.credithub.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ro.credithub.model.Client;
import ro.credithub.model.LogActiune;
import ro.credithub.repository.LogActiuneRepository;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;

    public void trimiteEmail(String destinatar, String subiect, String mesaj) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatar);
        message.setSubject(subiect);
        message.setText(mesaj);
        emailSender.send(message);
    }
}

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogActiuneRepository logActiuneRepository;

    public void logAction(Client client, String actiune) {
        LogActiune log = new LogActiune();
        log.setClient(client);
        log.setActiune(actiune);
        logActiuneRepository.save(log);
    }
}