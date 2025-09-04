import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (!user) return "Utilizator";

    if (user.role === "fizic") {
      return `${user.nume} ${user.prenume}`;
    }

    if (user.role === "juridic") {
      return `${user.nume} ${user.prenume}`;
    }

    if (user.role === "broker") {
      return `${user.nume} ${user.prenume}`;
    }

    return "Utilizator";
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container className="mt-5 pt-4">
      <h2 className="fw-bold mb-4">👋 Bun venit în contul tău, {getDisplayName()}!</h2>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title>📄 Consultă creditele tale</Card.Title>
              <Card.Text>
                Vezi detalii despre creditele tale, sume rămase și scadențe.
              </Card.Text>
              <Button variant="primary" size="sm" onClick={() => navigate('/credite')}>
                Vezi credite
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title>➕ Aplică pentru un nou credit</Card.Title>
              <Card.Text>
                Trimite cererea ta și urmărește statusul aplicației într-un singur loc.
              </Card.Text>
              <Button variant="primary" size="sm" onClick={() => navigate('/cereri-credit')}>
                Aplică acum
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title>🧾 Documentele mele</Card.Title>
              <Card.Text>
                Încarcă, descarcă și gestionează documentele tale importante.
              </Card.Text>
              <Button variant="primary" size="sm" onClick={() => navigate('/documente/upload')}>
                Gestionează
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title>📊 Verifică eligibilitatea</Card.Title>
              <Card.Text>
                Simulează condițiile pentru a afla dacă te încadrezi pentru un nou credit.
              </Card.Text>
              <Button variant="primary" size="sm" onClick={() => navigate('/eligibilitate')}>
                Simulează
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title>👤 Profilul meu</Card.Title>
              <Card.Text>
                Gestionează datele tale personale și de contact.
              </Card.Text>
              <Button variant="primary" size="sm" onClick={() => navigate('/profil')}>
                Actualizează
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title>🔓 Deconectează-te</Card.Title>
              <Card.Text>
                Închide sesiunea ta de utilizator în siguranță.
              </Card.Text>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
