import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Pagination, Spinner } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { AuthContext } from "../components/AuthContext";

const ITEMS_PER_PAGE = 12;

const VerificareEligibilitate = () => {
  const { user } = useContext(AuthContext);
  const token = sessionStorage.getItem("token");
  const tipClient = user?.role === "client_juridic" || user?.role === "juridic" ? "juridic" : "fizic";
  const isJuridic = tipClient === "juridic"

  const [profil, setProfil] = useState(null);
  const [venit, setVenit] = useState(0);
  const [error, setError] = useState("");

  const [tipuri, setTipuri] = useState([]);
  const [tipSelectat, setTipSelectat] = useState(null);
  const [suma, setSuma] = useState(10000);
  const [luni, setLuni] = useState(12);
  const [cheltuieli, setCheltuieli] = useState(0);
  const [rezultat, setRezultat] = useState(null);
  const [scadentar, setScadentar] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:5000/api/profil/${tipClient}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setProfil(data);
        if (data.venitLunar != null) setVenit(data.venitLunar);
        else setError("Nu am putut prelua venitul lunar din profil.");
      })
      .catch((err) => setError("Eroare la încărcarea profilului: " + err.message));
  }, [tipClient, token]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tipuricredite/by-client-type/${tipClient}`)
      .then((res) => res.json())
      .then((data) => setTipuri(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/cererecredit/eligibilitate", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCheltuieli(data.sumaRateActive ?? 0))
      .catch(() => setCheltuieli(0));
  }, [token, tipClient]);

  const handleSelectTipCredit = (e) => {
    const id = e.target.value;
    const tip = tipuri.find((t) => t.idTipCredit === parseInt(id));
    setTipSelectat(tip || null);
    if (tip) {
      setSuma(tip.sumaMinima);
      setLuni(tip.perioadaMinima);
      setRezultat(null);
      setCurrentPage(1);
      setError("");
    }
  };

  const calculeaza = () => {
    if (!tipSelectat) {
      setError("Selectează mai întâi un tip de credit.");
      return;
    }
    if (suma < tipSelectat.sumaMinima || suma > tipSelectat.sumaMaxima) {
      setError(`Suma trebuie să fie între ${tipSelectat.sumaMinima} și ${tipSelectat.sumaMaxima} RON.`);
      return;
    }
    if (luni < tipSelectat.perioadaMinima || luni > tipSelectat.perioadaMaxima) {
      setError(`Perioada trebuie să fie între ${tipSelectat.perioadaMinima} și ${tipSelectat.perioadaMaxima} luni.`);
      return;
    }
    setError("");

    const dobanda = tipSelectat.dobandaMaxima -
      ((luni / tipSelectat.perioadaMaxima) * (tipSelectat.dobandaMaxima - tipSelectat.dobandaMinima));
    const dobandaLunara = dobanda / 12 / 100;
    const rataLunara = (suma * dobandaLunara) / (1 - Math.pow(1 + dobandaLunara, -luni));
    const totalPlata = rataLunara * luni;
    const dobandaTotala = totalPlata - suma;
    const gradIndatorare = ((rataLunara + cheltuieli) / venit) * 100;
    const eligibil = gradIndatorare <= 40;

    setRezultat({
      dobanda: dobanda.toFixed(2),
      rata: rataLunara.toFixed(2),
      total: totalPlata.toFixed(2),
      dobandaTotala: dobandaTotala.toFixed(2),
      gradIndatorare: gradIndatorare.toFixed(1),
      eligibil,
    });

    const newScadentar = [];
    let sold = suma;
    for (let i = 1; i <= luni; i++) {
      const dobLuna = sold * dobandaLunara;
      const prinLuna = rataLunara - dobLuna;
      sold -= prinLuna;
      newScadentar.push({
        luna: i,
        rata: rataLunara.toFixed(2),
        principal: prinLuna.toFixed(2),
        dobanda: dobLuna.toFixed(2),
        sold: sold > 0 ? sold.toFixed(2) : "0.00",
      });
    }
    setScadentar(newScadentar);
    setCurrentPage(1);
  };

  const exportaPDF = async () => {
    if (!resultRef.current) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const totalPagesLocal = Math.ceil(scadentar.length / ITEMS_PER_PAGE);
    for (let page = 1; page <= totalPagesLocal; page++) {
      setCurrentPage(page);
      await new Promise((res) => setTimeout(res, 500));
      const element = resultRef.current.querySelector(".table-responsive");
      const canvas = await html2canvas(element, { scale: 1.5 });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (page > 1) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    setCurrentPage(1);
    pdf.save("eligibilitate_credit.pdf");
  };

  const totalPages = Math.ceil(scadentar.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = scadentar.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (!profil) return <Spinner animation="border" className="mt-5" />;

  const headerText = isJuridic
    ? `Firma: ${profil.denumire} (CUI: ${profil.cui})`
    : `Client: ${profil.prenume} ${profil.nume}`;

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm mb-4">
        <h5 className="fw-semibold">{headerText}</h5>
        <div>Email: {profil.email}</div>
        <div>Telefon: {profil.telefon}</div>
      </Card>
      <Card className="p-5 shadow rounded-4 border-0">
        <h2 className="text-center fw-bold mb-4 text-primary">
          📊 Verificare Eligibilitate Credit ({isJuridic ? "Persoană Juridică" : "Persoană Fizică"})
        </h2>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Label>Tip credit</Form.Label>
              <Form.Select value={tipSelectat?.idTipCredit || ""} onChange={handleSelectTipCredit}>
                <option value="">-- Selectează tipul de credit --</option>
                {tipuri.map((t) => (
                  <option key={t.idTipCredit} value={t.idTipCredit}>
                    {t.numeCredit}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Sumă solicitată</Form.Label>
              <Form.Control
                type="number"
                value={suma}
                onChange={(e) => setSuma(+e.target.value)}
              />
              {tipSelectat && (
                <div className="text-muted small">
                  Interval permis: {tipSelectat.sumaMinima} - {tipSelectat.sumaMaxima} RON
                </div>
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Durată (luni)</Form.Label>
              <Form.Control
                type="number"
                value={luni}
                onChange={(e) => setLuni(+e.target.value)}
              />
              {tipSelectat && (
                <div className="text-muted small">
                  Interval permis: {tipSelectat.perioadaMinima} - {tipSelectat.perioadaMaxima} luni
                </div>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Rate lunare active</Form.Label>
              <Form.Control type="number" value={cheltuieli} readOnly className="bg-light" />
            </Col>
          </Row>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="text-center">
            <Button
              onClick={calculeaza}
              variant="success"
              className="px-4 py-2 rounded-pill"
            >
              Calculează eligibilitatea
            </Button>
          </div>
        </Form>
      </Card>

      {rezultat && (
        <div ref={resultRef} className="mt-5">
          <Card className="p-4 shadow-sm mb-4">
            <h4 className="fw-bold mb-4 text-success">📄 Rezultatul Verificării</h4>
            <Row><Col>Dobândă estimată:</Col><Col className="text-end">{rezultat.dobanda}%</Col></Row>
            <Row><Col>Rată lunară:</Col><Col className="text-end">{rezultat.rata} RON</Col></Row>
            <Row><Col>Total plată:</Col><Col className="text-end">{rezultat.total} RON</Col></Row>
            <Row><Col>Dobândă totală:</Col><Col className="text-end">{rezultat.dobandaTotala} RON</Col></Row>
            <Row><Col>Grad de îndatorare:</Col><Col className="text-end">{rezultat.gradIndatorare}%</Col></Row>
            <Alert variant={rezultat.eligibil ? "success" : "danger"} className="mt-3">
              {rezultat.eligibil ? "✅ Te încadrezi pentru acest credit." : "❌ Gradul de îndatorare depășește 40%."}
            </Alert>
          </Card>

          <Card className="p-4 shadow-sm">
            <h4 className="fw-bold mb-3 text-secondary">📆 Scadențar</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Luna</th>
                    <th>Rată</th>
                    <th>Principal</th>
                    <th>Dobândă</th>
                    <th>Sold Rămas</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.luna}>
                      <td>{item.luna}</td>
                      <td>{item.rata} RON</td>
                      <td>{item.principal} RON</td>
                      <td>{item.dobanda} RON</td>
                      <td>{item.sold} RON</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination className="justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Card>

          <div className="text-end mt-3">
            <Button variant="outline-dark" onClick={exportaPDF} className="rounded-pill">
              💾 Salvează PDF
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default VerificareEligibilitate;
