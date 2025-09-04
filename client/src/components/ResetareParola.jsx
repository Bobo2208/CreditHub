import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const ResetareParola = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      if (res.ok) {
        setStatus({ type: "success", message: text });
      } else {
        setStatus({ type: "danger", message: text });
      }
    } catch {
      setStatus({ type: "danger", message: "Eroare la trimiterea cererii." });
    }
  };

  return (
    <Container className="d-flex justify-content-center" style={{ marginTop: 100, marginBottom: 60 }}>
      <Card className="shadow p-4 rounded-4 border-0" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="text-center fw-bold mb-3">🔁 Resetare Parolă</h3>
        <p className="text-muted text-center mb-4">Introdu adresa ta de email</p>

        {status.message && <Alert variant={status.type}>{status.message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="exemplu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Trimite linkul de resetare
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetareParola;
