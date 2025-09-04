import React from "react";
import { Container } from "react-bootstrap";

const Confidentialitate = () => {
  return (
    <Container className="py-5 mt-5">
      <h2 className="fw-bold mb-4">🔐 Politica de Confidențialitate</h2>
      <p>
        CreditHub respectă confidențialitatea datelor tale. Toate informațiile
        colectate sunt utilizate exclusiv pentru procesarea cererilor tale de
        credit.
      </p>
      <ul>
        <li>Nu vindem sau partajăm datele tale cu terți neautorizați.</li>
        <li>Toate datele sunt stocate securizat, conform legislației GDPR.</li>
        <li>Ai dreptul de a solicita modificarea sau ștergerea datelor tale oricând.</li>
        <li>Cookie-urile sunt folosite doar pentru funcționalități esențiale.</li>
      </ul>
      <p className="text-muted mt-4">
        Ultima actualizare: mai 2025
      </p>
    </Container>
  );
};

export default Confidentialitate;
