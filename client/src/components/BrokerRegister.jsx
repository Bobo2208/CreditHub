import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const BrokerRegister = () => {
  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    email: '',
    parola: '',
    confirmParola: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    const errs = {};
    if (!form.nume.trim()) errs.nume = 'Numele este obligatoriu.';
    if (!form.prenume.trim()) errs.prenume = 'Prenumele este obligatoriu.';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) errs.email = 'Email invalid.';
    if (form.parola.length < 8) errs.parola = 'Parola trebuie să aibă minim 8 caractere.';
    if (form.parola !== form.confirmParola) errs.confirmParola = 'Parolele nu coincid.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/broker/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume: form.nume,
          prenume: form.prenume,
          email: form.email,
          parola: form.parola
        }),
      });
      const data = await res.text();
      if (res.ok) {
        setSuccess('Cererea ta a fost trimisă. Vei primi un email după aprobare.');
        setForm({ nume: '', prenume: '', email: '', parola: '', confirmParola: '' });
      } else {
        setError(data || 'A apărut o eroare. Încearcă din nou.');
      }
    } catch (err) {
      setError('Eroare la conectarea cu serverul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center" style={{ marginTop: '100px', marginBottom: '60px' }}>
      <Card className="shadow p-4 rounded-4 border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <h3 className="text-center fw-bold mb-3">📝 Cerere cont Broker</h3>
        <p className="text-center text-muted mb-4">Trimite cererea. Contul va fi activat doar după aprobare.</p>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Nume</Form.Label>
            <Form.Control
              type="text"
              name="nume"
              value={form.nume}
              onChange={handleChange}
              isInvalid={!!errors.nume}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nume}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prenume</Form.Label>
            <Form.Control
              type="text"
              name="prenume"
              value={form.prenume}
              onChange={handleChange}
              isInvalid={!!errors.prenume}
            />
            <Form.Control.Feedback type="invalid">
              {errors.prenume}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email oficial</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Parolă</Form.Label>
            <Form.Control
              type="password"
              name="parola"
              value={form.parola}
              onChange={handleChange}
              isInvalid={!!errors.parola}
            />
            <Form.Control.Feedback type="invalid">
              {errors.parola}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirmare parolă</Form.Label>
            <Form.Control
              type="password"
              name="confirmParola"
              value={form.confirmParola}
              onChange={handleChange}
              isInvalid={!!errors.confirmParola}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmParola}
            </Form.Control.Feedback>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Trimite cererea'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default BrokerRegister;
