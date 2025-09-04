import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Card, Alert, Table } from "react-bootstrap";
import { AuthContext } from "../components/AuthContext";

const CereriClient = () => {
  const { user } = useContext(AuthContext);
  const token = sessionStorage.getItem("token");

  const [tipuri, setTipuri] = useState([]);
  const [cereri, setCereri] = useState([]);
  const [tipCredit, setTipCredit] = useState("");
  const [suma, setSuma] = useState("");
  const [luni, setLuni] = useState("");
  const [infoTip, setInfoTip] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const baseApi = "http://localhost:5000";

  useEffect(() => {
    if (!user || !token) return;
    const tipClient = user.role === "fizic" ? "fizic" : "juridic";
    fetch(`${baseApi}/api/tipuricredite/by-client-type/${tipClient}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setTipuri)
      .catch(() => setError("Nu s-au putut încărca tipurile de credit."));
    fetchCereri();
  }, [user, token]);

  useEffect(() => {
    const selected = tipuri.find((t) => t.idTipCredit === parseInt(tipCredit));
    setInfoTip(selected || null);
  }, [tipCredit, tipuri]);

  const fetchCereri = async () => {
    try {
      const res = await fetch(`${baseApi}/api/cererecredit/client`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Eroare la încărcarea cererilor.");
      let data = await res.json();
      
      data = data.map((c) => {
        let processedComments = '';
        let reasons = [];
        let comment = '';
        
        if (typeof c.comentarii === 'string') {
          try {
            const parsed = JSON.parse(c.comentarii);
            if (parsed.reasons && Array.isArray(parsed.reasons)) {
              reasons = parsed.reasons;
            }
            if (parsed.comment) {
              comment = parsed.comment;
            }
            processedComments = [...reasons, comment].filter(Boolean).join('. ');
          } catch {
            processedComments = c.comentarii;
          }
        } else if (c.comentarii) {
          processedComments = c.comentarii;
        }
        
        return { 
          ...c, 
          reasons, 
          comment, 
          processedComments: processedComments || '-'
        };
      });
      
      setCereri(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const validate = () => {
    const errs = {};
    if (!tipCredit) errs.tipCredit = "Selectează tipul de credit.";
    const valSuma = parseFloat(suma);
    if (isNaN(valSuma) || valSuma <= 0) errs.suma = "Suma trebuie să fie un număr pozitiv.";
    if (infoTip) {
      if (valSuma < infoTip.sumaMinima || valSuma > infoTip.sumaMaxima) {
        errs.suma = `Valoarea trebuie între ${infoTip.sumaMinima} și ${infoTip.sumaMaxima}.`;
      }
    }
    const valLuni = parseInt(luni);
    if (isNaN(valLuni) || valLuni <= 0) errs.luni = "Perioada trebuie un număr pozitiv.";
    if (infoTip) {
      if (valLuni < infoTip.perioadaMinima || valLuni > infoTip.perioadaMaxima) {
        errs.luni = `Durata trebuie între ${infoTip.perioadaMinima} și ${infoTip.perioadaMaxima} luni.`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    if (!validate()) return;

    try {
      const res = await fetch(`${baseApi}/api/cererecredit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          IdTipCredit: parseInt(tipCredit),
          Suma: parseFloat(suma),
          PerioadaLuni: parseInt(luni),
        }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (res.ok) {
        setStatus("✅ Cererea a fost trimisă cu succes.");
        setTipCredit(""); setSuma(""); setLuni(""); setInfoTip(null);
        fetchCereri();
      } else {
        setError((data && data.message) || data || "Eroare la trimiterea cererii.");
      }
    } catch (err) {
      setError("Eroare la trimiterea cererii: " + err.message);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("ro-RO", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const formatDobanda = (dobanda) => {
    if (dobanda === null || dobanda === undefined) return '-';
    const numericValue = parseFloat(dobanda);
    if (isNaN(numericValue)) return '-';
    return `${numericValue.toFixed(2)}%`;
  };

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <h4 className="fw-bold mb-4">📋 Cereri de credit</h4>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Trimite o cerere nouă</h5>
          {status && <Alert variant="success" dismissible onClose={() => setStatus("")}>{status}</Alert>}
          {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="selectTip">
              <Form.Label>Tip credit</Form.Label>
              <Form.Select
                value={tipCredit}
                onChange={(e) => setTipCredit(e.target.value)}
                isInvalid={!!errors.tipCredit}
              >
                <option value="">-- Selectează tipul de credit --</option>
                {tipuri.map((t) => (
                  <option key={t.idTipCredit} value={t.idTipCredit}>{t.numeCredit}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.tipCredit}
              </Form.Control.Feedback>
              {infoTip && (
                <Form.Text className="text-muted">
                  Suma: {infoTip.sumaMinima?.toLocaleString()} - {infoTip.sumaMaxima?.toLocaleString()} RON | Dobândă: {infoTip.dobandaMinima}% - {infoTip.dobandaMaxima}% | Durata: {infoTip.perioadaMinima} - {infoTip.perioadaMaxima} luni
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="inputSuma">
              <Form.Label>Suma dorită (RON)</Form.Label>
              <Form.Control
                type="number"
                value={suma}
                onChange={(e) => setSuma(e.target.value)}
                isInvalid={!!errors.suma}
              />
              <Form.Control.Feedback type="invalid">
                {errors.suma}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="inputLuni">
              <Form.Label>Perioadă (luni)</Form.Label>
              <Form.Control
                type="number"
                value={luni}
                onChange={(e) => setLuni(e.target.value)}
                isInvalid={!!errors.luni}
              />
              <Form.Control.Feedback type="invalid">
                {errors.luni}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary">Trimite cererea</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Cererile mele trimise</h5>
          {cereri.length === 0 ? (
            <Alert variant="info">Nu ai trimis nicio cerere până acum.</Alert>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>#</th><th>Tip</th><th>Suma</th><th>Luni</th>
                  <th>Dobândă</th><th>Comentarii</th><th>Data</th>
                </tr>
              </thead>
              <tbody>
                {cereri.map((c, index) => (
                  <tr key={c.idCerere}>
                    <td>{index + 1}</td>
                    <td>{c.tipCredit || c.numeCredit || '-'}</td>
                    <td>{c.sumaSolicitata?.toFixed(2)} RON</td>
                    <td>{c.perioadaLuni}</td>
                    <td>{formatDobanda(c.dobanda)}</td>
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                      {c.processedComments}
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CereriClient;