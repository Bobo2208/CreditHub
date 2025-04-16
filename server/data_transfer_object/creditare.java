package ro.credithub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalculatorCreditRequest {
    private BigDecimal suma;
    private Integer perioadaLuni;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalculatorCreditResponse {
    private BigDecimal suma;
    private Integer perioadaLuni;
    private BigDecimal dobandaAnuala;
    private BigDecimal rataLunara;
    private BigDecimal sumaTotala;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CerereConsultatieRequest {
    private String prenume;
    private String nume;
    private String email;
    private String telefon;
    private String tipCredit;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CerereConsultatieResponse {
    private Long id;
    private String mesaj;
    private String status;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicaCreditRequest {
    private BigDecimal suma;
    private Integer perioadaLuni;
    private String tipCredit;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicaCreditResponse {
    private Long idCerere;
    private String status;
    private String mesaj;
}