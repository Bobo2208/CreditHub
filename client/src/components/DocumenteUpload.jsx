import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Badge, Row, Col } from "react-bootstrap";

const DocumenteUpload = () => {
  const [file, setFile] = useState(null);
  const [documente, setDocumente] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");

  const tipDocumentColors = {
    Document: "primary"
    };

  const fetchDocumente = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/documente/lista", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Eroare la încărcarea documentelor");
      const data = await res.json();
      setDocumente(data);
    } catch (error) {
      setStatus(`Eroare: ${error.message}`);
    }
  };

  useEffect(() => {
    if (token) fetchDocumente();
    else setStatus("Nu ești autentificat.");
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Selectează un fișier înainte de a încărca.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/documente/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Document încărcat: ${data.tipDocument}`);
        setFile(null);
        document.getElementById("fileInput").value = "";
        fetchDocumente();
      } else {
        setStatus(data.message);
      }
    } catch (error) {
      setStatus(`Eroare la încărcare: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmi ștergerea documentului?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/documente/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Șters: ${data.message}`);
        fetchDocumente();
      } else {
        setStatus(data.message);
      }
    } catch (error) {
      setStatus(`Eroare la ștergere: ${error.message}`);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <h3 className="fw-bold mb-4 text-center text-dark">Gestionare Documente</h3>

      {status && (
        <Alert variant="info" onClose={() => setStatus("")} dismissible>
          {status}
        </Alert>
      )}

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3 fw-semibold text-dark">Încărcare document</h5>
          <Form onSubmit={handleUpload}>
            <Row className="align-items-end">
              <Col md={9}>
                <Form.Group controlId="fileInput">
                  <Form.Label>Fișier (PDF, JPG, PNG, DOC)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading || !file}
                >
                  {loading ? "Se încarcă..." : "Încarcă"}
                </Button>
              </Col>
            </Row>
            {file && (
              <small className="text-muted d-block mt-2">
                Fișier selectat: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </small>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3 fw-semibold text-dark">
            Documente încărcate ({documente.length})
          </h5>
          {documente.length === 0 ? (
            <Alert variant="secondary">Nu există documente încărcate.</Alert>
          ) : (
            documente.map((doc) => (
              <Card
                key={doc.idDocument}
                className="mb-3 border-light shadow-sm"
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">
                      <Badge
                        bg={
                          tipDocumentColors[doc.tipDocument] || "secondary"
                        }
                        className="me-2"
                      >
                        {doc.tipDocument}
                      </Badge>
                      {doc.numeFisier}
                    </div>
                    <div className="text-muted small">
                      Încărcat la: {formatDate(doc.uploadDate)}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      href={`http://localhost:5000/${doc.fisierPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vizualizează
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(doc.idDocument)}
                    >
                      Șterge
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Card.Body>
        <Card.Footer className="text-center">
          <a
            href="/documentatie"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vezi aici documentele necesare
          </a>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default DocumenteUpload;
