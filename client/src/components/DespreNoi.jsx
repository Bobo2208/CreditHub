import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const DespreNoi = () => {
  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col md={12}>
          <h1 className="fw-bold mb-3">Despre CreditHub</h1>
          <p className="text-muted fs-5">
            CreditHub este o platformă digitală care aduce mai aproape soluțiile financiare moderne pentru toți – persoane fizice și juridice. 
            Cu o abordare simplificată și accesibilă, oferim un proces transparent, rapid și sigur pentru obținerea creditelor.
          </p>
        </Col>
      </Row>

      <Row className="text-center mb-4">
        <Col>
          <h2 className="fw-bold">Valorile Noastre</h2>
          <p className="text-muted fs-5">
            Ne ghidăm activitatea după principii clare, care reflectă angajamentul nostru față de clienți, comunitate și inovație.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="p-4 shadow-sm h-100 border-0 rounded-4">
            <div className="mb-3 fs-3 text-primary">📢</div>
            <Card.Title className="fw-semibold">Claritate</Card.Title>
            <Card.Text>
              Toate ofertele și condițiile noastre sunt formulate clar și accesibil. Credem în comunicarea onestă și în evitarea termenilor ambigui sau înșelători.
            </Card.Text>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 shadow-sm h-100 border-0 rounded-4">
            <div className="mb-3 fs-3 text-primary">🚀</div>
            <Card.Title className="fw-semibold">Inovație</Card.Title>
            <Card.Text>
              Ne reinventăm constant platforma și procesele pentru a livra soluții digitale rapide și sigure. Investim în tehnologie pentru confortul tău financiar.
            </Card.Text>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 shadow-sm h-100 border-0 rounded-4">
            <div className="mb-3 fs-3 text-primary">💙</div>
            <Card.Title className="fw-semibold">Respect</Card.Title>
            <Card.Text>
              Fiecare client contează. Tratăm cu seriozitate nevoile tale, oferindu-ți consiliere empatică și decizii echitabile, fără discriminare.
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DespreNoi;
