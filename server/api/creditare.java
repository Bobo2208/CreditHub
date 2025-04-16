package ro.credithub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.credithub.dto.*;
import ro.credithub.model.CerereCredit;
import ro.credithub.security.UserDetailsImpl;
import ro.credithub.service.CreditService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CreditController {

    private final CreditService creditService;

    /**
     * Endpoint public pentru calculul ratei creditului
     */
    @PostMapping("/api/public/calculator-credit")
    public ResponseEntity<CalculatorCreditResponse> calculeazaCredit(@RequestBody CalculatorCreditRequest request) {
        CalculatorCreditResponse response = creditService.calculeazaCredit(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint public pentru cereri de consultație
     */
    @PostMapping("/api/public/cere-consultatie")
    public ResponseEntity<CerereConsultatieResponse> cereConsultatie(@RequestBody CerereConsultatieRequest request) {
        CerereConsultatieResponse response = creditService.cereConsultatie(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint protejat pentru aplicarea pentru credit (necesită autentificare)
     */
    @PostMapping("/api/credite/aplica")
    public ResponseEntity<AplicaCreditResponse> aplicaPentruCredit(@RequestBody AplicaCreditRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long clientId = userDetails.getId();
        
        AplicaCreditResponse response = creditService.aplicaPentruCredit(clientId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint protejat pentru vizualizarea cererilor de credit ale clientului
     */
    @GetMapping("/api/credite/cereri")
    public ResponseEntity<List<CerereCredit>> getCereriCredit() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long clientId = userDetails.getId();
        
        List<CerereCredit> cereri = creditService.getCereriCreditClient(clientId);
        return ResponseEntity.ok(cereri);
    }
}