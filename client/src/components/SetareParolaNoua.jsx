import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const SetareParolaNoua = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setStatus({
        type: "danger",
        message: "Link invalid sau incomplet. Te rugăm să verifici emailul.",
      });
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: "danger", message: "Parolele nu coincid." });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/set-new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Parola a fost resetată cu succes!" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const msg = await res.text();
        setStatus({ type: "danger", message: msg || "Eroare la resetarea parolei." });
      }
    } catch (err) {
      setStatus({ type: "danger", message: "Eroare la conectarea cu serverul." });
    }
  };

  return (
    <Container className="d-flex justify-content-center" style={{ marginTop: 100, marginBottom: 60 }}>
      <Card className="shadow p-4 rounded-4 border-0" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="text-center fw-bold mb-3">🔑 Resetare parolă</h3>
        <p className="text-muted text-center mb-4">Setează o parolă nouă pentru contul tău</p>

        {status.message && <Alert variant={status.type}>{status.message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Parolă nouă</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmare parolă</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Salvează parola nouă
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SetareParolaNoua;
