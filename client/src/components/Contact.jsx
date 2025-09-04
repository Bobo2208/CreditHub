import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Contact = () => {
  const [form, setForm] = useState({
    nume: '',
    email: '',
    telefon: '',
    subiect: '',
    mesaj: ''
  });

  const [status, setStatus] = useState(null); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Mesajul a fost trimis cu succes!' });
        setForm({ nume: '', email: '', telefon: '', subiect: '', mesaj: '' });
      } else {
        const errText = await res.text();
        setStatus({ type: 'error', message: `Eroare la trimitere: ${errText}` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'A apărut o eroare la trimiterea mesajului.' });
    }
  };

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="fw-bold">Contactează-ne</h1>
          <p className="text-muted fs-5">
            Suntem aici pentru a te ajuta. Contactează-ne pentru orice întrebare privind produsele și serviciile noastre.
          </p>
          <hr className="mx-auto" style={{ width: '60px', height: '3px', background: '#0d6efd', border: 'none' }} />
        </Col>
      </Row>

      <Row className="mb-5 text-center g-4">
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 rounded-4 h-100">
            <div className="mb-2 fs-2 text-primary">📍</div>
            <h5 className="fw-bold">Adresa Noastră</h5>
            <p className="text-muted mb-0">Bulevardul Unirii 22</p>
            <p className="text-muted">București, România</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 rounded-4 h-100">
            <div className="mb-2 fs-2 text-primary">📞</div>
            <h5 className="fw-bold">Telefon</h5>
            <p className="text-muted mb-0">+40 712 345 678</p>
            <p className="text-muted">Luni - Vineri: 9:00 - 18:00</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 rounded-4 h-100">
            <div className="mb-2 fs-2 text-primary">✉️</div>
            <h5 className="fw-bold">Email</h5>
            <p className="text-muted mb-0">contact@credithub.ro</p>
            <p className="text-muted">support@credithub.ro</p>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="p-4 shadow-sm border-0 rounded-4">
            <h5 className="fw-bold mb-3">Trimite-ne un mesaj</h5>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Nume complet *"
                    name="nume"
                    value={form.nume}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="email"
                    placeholder="Email *"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Telefon"
                    name="telefon"
                    value={form.telefon}
                    onChange={handleChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Subiect"
                    name="subiect"
                    value={form.subiect}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Mesajul tău..."
                  name="mesaj"
                  value={form.mesaj}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Trimite
              </Button>
              {status && (
                <Alert className="mt-3" variant={status.type === 'success' ? 'success' : 'danger'}>
                  {status.message}
                </Alert>
              )}
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.554523280536!2d26.105779276508603!3d44.42675647107739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4856f3b1d7%3A0xede3db902d544222!2sBulevardul%20Unirii%2022%2C%20Bucure%C8%99ti!5e0!3m2!1sro!2sro!4v1714748590704!5m2!1sro!2sro"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '360px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
