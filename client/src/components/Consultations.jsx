// src/pages/CreditConsultation.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const CreditConsultation = () => {
  const [formData, setFormData] = useState({
    prenume: '',
    nume: '',
    email: '',
    telefon: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleAplicaClick = () => {
    const rawUser = sessionStorage.getItem("user") || localStorage.getItem("user");

    if (rawUser) {
      let user;
      try {
        user = JSON.parse(rawUser);
      } catch {
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
        return navigate("/login");
      }

      const role = (user.role || '').trim().toLowerCase();

      if (role === "fizic" || role === "juridic") {
        return setError("Ai deja cont");
      }
      if (role === "broker") {
        return navigate("/register/select", { state: formData });
      }
      return setError("Ai deja cont");
    }

    navigate("/register/select", { state: formData });
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Text explicativ */}
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

          <Button variant="primary" size="lg" onClick={handleAplicaClick}>
            Aplică pentru credit acum →
          </Button>
        </Col>

        <Col md={6}>
          <Card className="shadow p-3 py-2 rounded-4">
            <h4 className="fw-bold mb-3">Creează un cont chiar acum!</h4>

            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}

            <Row className="mb-3">
              <Col>
                <Form.Label>Prenume</Form.Label>
                <Form.Control
                  type="text"
                  name="prenume"
                  value={formData.prenume}
                  onChange={handleChange}
                  placeholder="Prenumele tău"
                  required
                />
              </Col>
              <Col>
                <Form.Label>Nume</Form.Label>
                <Form.Control
                  type="text"
                  name="nume"
                  value={formData.nume}
                  onChange={handleChange}
                  placeholder="Numele tău"
                  required
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplu@email.com"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
                placeholder="07xx xxx xxx"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={handleAplicaClick}
            >
              Pasul următor
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreditConsultation;
