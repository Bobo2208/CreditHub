import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import { AuthContext } from "../components/AuthContext";

const ProfilClient = () => {
  const { user } = useContext(AuthContext);
  const token = sessionStorage.getItem("token");

  const [profil, setProfil] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const rol = user?.role;
  const tipClient = rol === "client_juridic" || rol === "juridic" ? "juridic" : "fizic";
  const isFizic = tipClient === "fizic";
  const isJuridic = tipClient === "juridic";

  useEffect(() => {
    fetch(`http://localhost:5000/api/profil/${tipClient}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => setProfil(data))
      .catch((err) => setError("Eroare la încărcarea profilului: " + err.message));
  }, [tipClient, token]);

  const validate = () => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\d{10,14}$/;
    const cuiRe = /^\d+$/;

    if (isFizic) {
      if (!profil?.nume?.trim()) errs.nume = "Numele este obligatoriu.";
      if (!profil?.prenume?.trim()) errs.prenume = "Prenumele este obligatoriu.";
    }

    if (isJuridic) {
      if (!profil?.denumire?.trim()) errs.denumire = "Denumirea firmei este obligatorie.";
      if (!profil?.cui?.trim() || !cuiRe.test(profil.cui)) errs.cui = "CUI invalid.";
      if (!profil?.nume?.trim()) errs.nume = "Numele reprezentantului este obligatoriu.";
      if (!profil?.prenume?.trim()) errs.prenume = "Prenumele reprezentantului este obligatoriu.";
    }

    if (!emailRe.test(profil?.email || "")) errs.email = "Email invalid.";
    if (!phoneRe.test(profil?.telefon || "")) errs.telefon = "Telefon invalid (10-14 cifre).";
    if (!profil?.adresa?.trim() || profil.adresa.length < 5) errs.adresa = "Adresa prea scurtă.";
    if (profil?.venitLunar === undefined || profil.venitLunar <= 0) errs.venitLunar = "Venit lunar trebuie să fie > 0.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => {
    setProfil({ ...profil, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
    setStatus("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    if (!validate()) return;

    const payload = isFizic
      ? {
          nume: profil.nume,
          prenume: profil.prenume,
          email: profil.email,
          telefon: profil.telefon,
          adresa: profil.adresa,
          venitLunar: parseFloat(profil.venitLunar),
        }
      : {
          denumire: profil.denumire,
          cui: profil.cui,
          nume: profil.nume,
          prenume: profil.prenume,
          email: profil.email,
          telefon: profil.telefon,
          adresa: profil.adresa,
          venitLunar: parseFloat(profil.venitLunar),
        };

    try {
      const res = await fetch(`http://localhost:5000/api/profil/${tipClient}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("✅ Datele au fost actualizate cu succes.");
    } catch (err) {
      setError("Eroare la salvare: " + err.message);
    }
  };

  if (!profil) return <Spinner animation="border" className="mt-5" />;

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <h4 className="fw-bold mb-4">👤 Profilul meu ({isFizic ? "Persoană Fizică" : "Persoană Juridică"})</h4>

      {status && <Alert variant="success" dismissible onClose={() => setStatus("")}>{status}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit} noValidate>
            <Row>
              {isFizic && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Nume</Form.Label>
                      <Form.Control
                        value={profil.nume}
                        onChange={handleChange("nume")}
                        isInvalid={!!errors.nume}
                      />
                      <Form.Control.Feedback type="invalid">{errors.nume}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Prenume</Form.Label>
                      <Form.Control
                        value={profil.prenume}
                        onChange={handleChange("prenume")}
                        isInvalid={!!errors.prenume}
                      />
                      <Form.Control.Feedback type="invalid">{errors.prenume}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </>
              )}

              {isJuridic && (
                <>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Denumire firmă</Form.Label>
                      <Form.Control
                        value={profil.denumire}
                        onChange={handleChange("denumire")}
                        isInvalid={!!errors.denumire}
                      />
                      <Form.Control.Feedback type="invalid">{errors.denumire}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>CUI</Form.Label>
                      <Form.Control
                        value={profil.cui}
                        onChange={handleChange("cui")}
                        isInvalid={!!errors.cui}
                      />
                      <Form.Control.Feedback type="invalid">{errors.cui}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Nume reprezentant</Form.Label>
                      <Form.Control
                        value={profil.nume}
                        onChange={handleChange("nume")}
                        isInvalid={!!errors.nume}
                      />
                      <Form.Control.Feedback type="invalid">{errors.nume}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Prenume reprezentant</Form.Label>
                      <Form.Control
                        value={profil.prenume}
                        onChange={handleChange("prenume")}
                        isInvalid={!!errors.prenume}
                      />
                      <Form.Control.Feedback type="invalid">{errors.prenume}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profil.email}
                    onChange={handleChange("email")}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Telefon</Form.Label>
                  <Form.Control
                    value={profil.telefon}
                        onChange={handleChange("telefon")}
                        isInvalid={!!errors.telefon}
                      />
                      <Form.Control.Feedback type="invalid">{errors.telefon}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Adresă</Form.Label>
                  <Form.Control
                    value={profil.adresa}
                    onChange={handleChange("adresa")}
                    isInvalid={!!errors.adresa}
                  />
                  <Form.Control.Feedback type="invalid">{errors.adresa}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Venit lunar (RON)</Form.Label>
                  <Form.Control
                    type="number"
                    value={profil.venitLunar}
                    onChange={handleChange("venitLunar")}
                    isInvalid={!!errors.venitLunar}
                  />
                  <Form.Control.Feedback type="invalid">{errors.venitLunar}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button type="submit" variant="primary">Salvează modificările</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilClient;
