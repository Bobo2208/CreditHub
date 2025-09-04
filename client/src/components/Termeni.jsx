import React from "react";
import { Container } from "react-bootstrap";

const Termeni = () => {
  return (
    <Container className="py-5 mt-5">
      <h2 className="fw-bold mb-4">📄 Termeni și Condiții</h2>
      <p>
        Utilizarea platformei CreditHub implică acceptarea acestor termeni. Ne
        rezervăm dreptul de a actualiza condițiile fără notificare prealabilă.
      </p>
      <ul>
        <li>Platforma este destinată exclusiv utilizării personale.</li>
        <li>Este interzisă copierea sau distribuirea conținutului fără acordul nostru.</li>
        <li>Orice tentativă de fraudă va fi raportată autorităților competente.</li>
        <li>Toate serviciile oferite sunt supuse aprobării financiare.</li>
      </ul>
      <p className="text-muted mt-4">
        Ultima actualizare: mai 2025
      </p>
    </Container>
  );
};

export default Termeni;
