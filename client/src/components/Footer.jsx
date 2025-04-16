import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          {/* Logo + Descriere */}
          <Col md={3}>
            <h5 className="mb-3 d-flex align-items-center">
              <span className="me-2">
                <i className="bi bi-credit-card-2-front"></i>
              </span>
              CreditHub
            </h5>
            <p className="small">
              Soluții de creditare personalizate pentru fiecare nevoie. Ne
              mândrim cu servicii transparente și accesibile.
            </p>
            <div className="d-flex gap-3 fs-5 mt-3">
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
              <FaGithub />
            </div>
          </Col>

          {/* Produse */}
          <Col md={3}>
            <h6 className="fw-bold mb-3">Produse</h6>
            <ul className="list-unstyled small">
              <li><Button variant="link"
                className="text-primary p-0 text-decoration-none mt-auto align-self-center">Credite Persoane Fizice</Button></li>
              <li><Button variant="link"
                className="text-primary p-0 text-decoration-none mt-auto align-self-center">Credite Persoane Juridice</Button></li>
            </ul>
          </Col>

          {/* Link-uri Utile */}
          <Col md={3}>
            <h6 className="fw-bold mb-3">Link-uri Utile</h6>
            <ul className="list-unstyled small">
              <li><Button variant="link"
                className="text-primary p-0 text-decoration-none mt-auto align-self-center">Despre Noi</Button></li>
              <li><Button
              variant="link"
              className="text-primary p-0 text-decoration-none mt-auto align-self-center">Carieră</Button></li>
              <li><Button
              variant="link"
              className="text-primary p-0 text-decoration-none mt-auto align-self-center">Termeni și Condiții</Button></li>
              <li><Button
              variant="link"
              className="text-primary p-0 text-decoration-none mt-auto align-self-center">Politica de Confidențialitate</Button></li>
              <li><Button
              variant="link"
              className="text-primary p-0 text-decoration-none mt-auto align-self-center">Întrebări Frecvente</Button></li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={3}>
            <h6 className="fw-bold mb-3">Contact</h6>
            <ul className="list-unstyled small">
              <li className="d-flex align-items-center mb-2">
                <FaMapMarkerAlt className="me-2" />
                Bulevardul Unirii 22, București, România
              </li>
              <li className="d-flex align-items-center mb-2">
                <FaPhoneAlt className="me-2" />
                +40 747 358 137
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-2" />
                contact@credithub.ro
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-light mt-4" />

        <p className="text-center small mt-3 mb-0">
          © 2025 CreditHub. Toate drepturile rezervate.
        </p>
      </Container>
    </footer>
  );
}
