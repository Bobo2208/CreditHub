import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const CreditConsultation = () => {
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        
        <Col md={6}>
          <h2 className="fw-bold mb-3">
            Pregătit să faci primul pas către viitorul tău financiar?
          </h2>
          <p className="text-muted mb-4">
            Completează formularul de aplicare online și un consultant te va contacta în cel mai scurt timp pentru a discuta despre opțiunile tale de creditare.
          </p>

          <ul className="list-unstyled mb-4">
            <li className="mb-2">✔ Dobânzi competitive începând de la 9.49%</li>
            <li className="mb-2">✔ Aprobare în 24 de ore pentru creditele personale</li>
            <li className="mb-2">✔ Zero comision de analiză</li>
            <li className="mb-2">✔ Fără garanții pentru sume până la 20.000 RON</li>
            <li className="mb-2">✔ Consultanță personalizată gratuită</li>
          </ul>

          <Button variant="primary" size="lg">
            Aplică pentru credit acum →
          </Button>
        </Col>

        
        <Col md={6}>
          <Card className="shadow p-3 py-2 rounded-4">
            <h4 className="fw-bold mb-3">Programează o consultație</h4>

            <Row className="mb-3">
              <Col>
                <Form.Label>Prenume</Form.Label>
                <Form.Control type="text" placeholder="Prenumele tău" />
              </Col>
              <Col>
                <Form.Label>Nume</Form.Label>
                <Form.Control type="text" placeholder="Numele tău" />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="exemplu@email.com" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control type="text" placeholder="07xx xxx xxx" />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Tipul de credit</Form.Label>
              <Form.Select>
                <option>Selectează tipul de credit</option>
                <option>Credit personal</option>
                <option>Credit ipotecar</option>
                <option>Refinanțare</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" size="lg" className="w-100">
              Trimite solicitarea
            </Button>

            
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreditConsultation;
