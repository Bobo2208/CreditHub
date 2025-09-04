import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../components/AuthContext';

const BrokerLogin = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/broker-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        login(data, true);
        navigate('/broker-dashboard');
      } else {
        setError(data.message || 'Email sau parolă incorectă.');
      }
    } catch (err) {
      setError('Eroare la conectarea cu serverul.');
    }
  };

  return (
    <Container className="d-flex justify-content-center" style={{ marginTop: '100px', marginBottom: '60px' }}>
      <Card className="shadow p-4 rounded-4 border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center fw-bold mb-3">🔑 Autentificare Broker</h3>
        <p className="text-center text-muted mb-4">Accesează contul de broker pentru a continua</p>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="broker@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Parolă</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
              required
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button type="submit" variant="primary" className="w-100 mb-2">
            Autentifică-te
          </Button>

          <div className="text-center mt-3">
            <span className="text-muted">Nu ai cont?</span>{' '}
            <Button
              variant="link"
              className="p-0 text-primary fw-bold text-decoration-none"
              onClick={() => navigate('/broker-register')}
            >
              Înregistrează-te aici
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default BrokerLogin;
