import React, { useState, useEffect } from "react";
import { Container, Card, Alert, Table, Badge, Spinner } from "react-bootstrap";

const CrediteClient = () => {
  const [credite, setCredite] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchCredite();
  }, []);

  const fetchCredite = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/istoriccredite/client", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("RESPONSE STATUS:", res.status);

    const data = await res.json();
    console.log("DATA PRIMITĂ:", data); 

    if (!res.ok) throw new Error(data?.message || "Eroare la încărcarea creditelor.");

    if (!Array.isArray(data)) {
      console.warn("API nu a returnat un array:", data);
      setCredite([]);
      return;
    }

    setCredite(data);
    console.log("Credite setate în state:", data); 
  } catch (err) {
    console.error("EROARE FETCH:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "-";
    }
  };

  const statusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "activ": return <Badge bg="success">Activ</Badge>;
      case "inchis": return <Badge bg="secondary">Închis</Badge>;
      case "intarziat": return <Badge bg="danger">Întârziat</Badge>;
      default: return <Badge bg="warning">Necunoscut</Badge>;
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "1000px" }}>
      <h4 className="fw-bold mb-4">💳 Creditele mele</h4>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Credit curent / Istoric</h5>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : credite.length === 0 ? (
            <Alert variant="info">Nu ai credite active sau închise.</Alert>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tip credit</th>
                  <th>Suma</th>
                  <th>Rată</th>
                  <th>Dobândă</th>
                  <th>Durată</th>
                  <th>Status</th>
                  <th>Data început</th>
                </tr>
              </thead>
              <tbody>
                {credite.map((c, index) => (
                  <tr key={c.idCredit || index}>
                    <td>{index + 1}</td>
                    <td>{c.numeCredit || c.nume_credit || "-"}</td>
                    <td>{c.suma?.toFixed(2) || "-"} RON</td>
                    <td>{c.rata?.toFixed(2) || "-"} RON</td>
                    <td>{c.dobanda != null ? `${c.dobanda}%` : "-"}</td>
                    <td>{c.durata || "-"} luni</td>
                    <td>{statusBadge(c.status)}</td>
                    <td>{formatDate(c.dataStart)}</td>
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

export default CrediteClient;