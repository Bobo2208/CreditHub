import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../components/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [tineMinte, setTineMinte] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola }),
      });

      if (!res.ok) {
        let errMsg = 'Email sau parolă incorectă.';
        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const { message } = await res.json();
          if (message) errMsg = message;
        } else {
          const text = await res.text();
          if (text) errMsg = text;
        }

        setError(errMsg);
        return;
      }

      const data = await res.json();

      if (data.role === 'broker') {
        setError('Acesta e login pentru clienți.');
        return;
      }

      const storage = tineMinte ? localStorage : sessionStorage;
      const userPayload = {
        id: data.id,
        nume: data.nume,
        prenume: data.prenume,
        role: data.role,
      };
      if (data.venit_lunar !== undefined) {
        userPayload.venit = data.venit_lunar;
      }

      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(userPayload));

      login(data, tineMinte);
      navigate('/dashboard');
    } catch (err) {
      console.error('Fetch error detaliat:', err);
      setError('Eroare la conectarea cu serverul.');
    }
  };

  return (
    <Container
      className="d-flex justify-content-center"
      style={{ marginTop: '100px', marginBottom: '60px' }}
    >
      <Card
        className="shadow p-4 rounded-4 border-0"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h3 className="text-center fw-bold mb-3">🔐 Autentificare</h3>
        <p className="text-center text-muted mb-4">
          Accesează contul tău pentru a continua
        </p>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="exemplu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginParola">
            <Form.Label>Parolă</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Check
              type="checkbox"
              label="Ține-mă minte"
              checked={tineMinte}
              onChange={() => setTineMinte(!tineMinte)}
            />
            <Button
              variant="link"
              className="p-0 text-decoration-none text-primary"
              onClick={() => navigate('/resetare-parola')}
            >
              Ai uitat parola?
            </Button>
          </div>

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Button type="submit" variant="primary" className="w-100 mb-2">
            Autentifică-te
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span className="text-muted">Nu ai cont?</span>{' '}
          <Button
            variant="link"
            className="p-0 text-primary fw-bold text-decoration-none"
            onClick={() => navigate('/register/select')}
          >
            Înregistrează-te aici
          </Button>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <p className="mb-1 text-muted">Ești broker?</p>
          <Button
            variant="outline-primary"
            className="w-100 mb-2"
            onClick={() => navigate('/broker-login')}
          >
            Autentificare Broker
          </Button>
          <Button
            variant="link"
            className="p-0 text-primary fw-bold text-decoration-none"
            onClick={() => navigate('/broker-register')}
          >
            Înregistrare Broker
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
