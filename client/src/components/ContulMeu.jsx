import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ContulMeu = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/auth/user-info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Autentificare necesară");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Contul Meu</h2>
      <Card className="mb-4 p-3 shadow-sm">
        <h5>Informații utilizator</h5>
        <p><strong>Nume:</strong> {userData.nume}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Telefon:</strong> {userData.telefon || "-"}</p>
        <p><strong>Rol:</strong> {userData.rol}</p>
      </Card>

      <Row className="g-4">
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6>Cererile Mele</h6>
            <Button variant="outline-primary" onClick={() => navigate("/cereri")}>Vezi cererile</Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6>Credite Active</h6>
            <Button variant="outline-primary" onClick={() => navigate("/credite")}>Vezi creditele</Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6>Documente</h6>
            <Button variant="outline-primary" onClick={() => navigate("/documente/upload")}>Administrează documentele</Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6>Schimbă Parola</h6>
            <Button variant="outline-warning" onClick={() => navigate("/resetare-parola")}>Resetare parolă</Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6>Delogare</h6>
            <Button variant="danger" onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}>Deloghează-te</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContulMeu;
