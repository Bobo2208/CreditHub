import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Pagination } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ITEMS_PER_PAGE = 12;

const SimulareCredit = () => {
  const [tipClient, setTipClient] = useState("fizic");
  const [tipuri, setTipuri] = useState([]);
  const [tipSelectat, setTipSelectat] = useState(null);
  const [suma, setSuma] = useState(10000);
  const [luni, setLuni] = useState(12);
  const [venit, setVenit] = useState("");
  const [rezultat, setRezultat] = useState(null);
  const [scadentar, setScadentar] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/tipuricredite/by-client-type/${tipClient}`)
      .then(res => res.json())
      .then(data => setTipuri(data))
      .catch(err => console.error("Eroare la fetch:", err));
  }, [tipClient]);

  const handleSelectTipCredit = id => {
    const tip = tipuri.find(t => t.idTipCredit === parseInt(id));
    setTipSelectat(tip);
    if (tip) {
      setSuma(tip.sumaMinima);
      setLuni(tip.perioadaMinima);
    }
  };

  const calculeaza = () => {
    if (!tipSelectat || !venit) return;
    const { dobandaMinima: dobMin, dobandaMaxima: dobMax, perioadaMinima: luniMin, perioadaMaxima: luniMax, sumaMinima, sumaMaxima } = tipSelectat;
    if (suma < sumaMinima || suma > sumaMaxima) {
      setError(`Suma între ${sumaMinima} și ${sumaMaxima} RON.`);
      return;
    }
    if (luni < luniMin || luni > luniMax) {
      setError(`Perioada între ${luniMin} și ${luniMax} luni.`);
      return;
    }
    setError("");
    const dobanda = dobMax - ((luni / luniMax) * (dobMax - dobMin));
    const dobLun = dobanda/12/100;
    const rata = (suma * dobLun) / (1 - Math.pow(1 + dobLun, -luni));
    const total = rata * luni;
    const dobTotal = total - suma;
    const procentVenit = (rata / venit) * 100;
    setRezultat({
      dobanda: dobanda.toFixed(2),
      rata: rata.toFixed(2),
      total: total.toFixed(2),
      dobandaTotala: dobTotal.toFixed(2),
      procentVenit: procentVenit.toFixed(1)
    });
    let sc = [], sold = suma;
    for (let i=1; i<=luni; i++){
      const dobL = sold * dobLun;
      const principal = rata - dobL;
      sold -= principal;
      sc.push({
        luna: i,
        rata: rata.toFixed(2),
        principal: principal.toFixed(2),
        dobanda: dobL.toFixed(2),
        sold: sold>0? sold.toFixed(2):"0.00"
      });
    }
    setScadentar(sc);
    setCurrentPage(0);
  };

  const pages = [];
  for (let i=0; i<scadentar.length; i+=ITEMS_PER_PAGE) pages.push(scadentar.slice(i, i+ITEMS_PER_PAGE));

  const exportaPDF = async () => {
    const pdf = new jsPDF("p","mm","a4");
    for (let idx=0; idx<pages.length; idx++){
      const elem = document.getElementById(`page-${idx}`);
      elem.style.display = 'block';
      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(elem);
      const img = canvas.toDataURL("image/png");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w)/canvas.width;
      if (idx>0) pdf.addPage();
      pdf.addImage(img,"PNG",0,0,w,h);
      if (idx !== currentPage) elem.style.display = 'none';
    }
    pdf.save("simulare_credit.pdf");
  };

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-4">📊 Simulează Credit</h2>
      <Card className="p-4 shadow-sm mb-4">
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Tip client</Form.Label>
            <Form.Select value={tipClient} onChange={e=>setTipClient(e.target.value)}>
              <option value="fizic">Fizic</option>
              <option value="juridic">Juridic</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Tip credit</Form.Label>
            <Form.Select value={tipSelectat?.idTipCredit||""} onChange={e=>handleSelectTipCredit(e.target.value)}>
              <option value="">-- Alege --</option>
              {tipuri.map(t=><option key={t.idTipCredit} value={t.idTipCredit}>{t.numeCredit}</option>)}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Venit lunar</Form.Label>
            <Form.Control type="number" value={venit} onChange={e=>setVenit(parseFloat(e.target.value))} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Sumă</Form.Label>
            <Form.Control type="number" value={suma} onChange={e=>setSuma(parseFloat(e.target.value))} />
            {tipSelectat && <div className="text-muted small mt-1">Interval: {tipSelectat.sumaMinima} - {tipSelectat.sumaMaxima} RON</div>}
          </Col>
          <Col md={6}>
            <Form.Label>Perioada (luni)</Form.Label>
            <Form.Control type="number" value={luni} onChange={e=>setLuni(parseInt(e.target.value))} />
            {tipSelectat && <div className="text-muted small mt-1">Interval: {tipSelectat.perioadaMinima} - {tipSelectat.perioadaMaxima} luni</div>}
          </Col>
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="primary" onClick={calculeaza}>Calculează</Button>
      </Card>

      {rezultat && (
        <Card className="p-4 shadow rounded-4 border-0 mb-4">
          <h5 className="fw-bold text-success mb-3">Rezultat simulare</h5>
          <Row><Col>Dobândă:</Col><Col className="text-end">{rezultat.dobanda}%</Col></Row>
          <Row><Col>Rată lunar:</Col><Col className="text-end">{rezultat.rata} RON</Col></Row>
          <Row><Col>Total plată:</Col><Col className="text-end">{rezultat.total} RON</Col></Row>
          <Row><Col>Dobândă totală:</Col><Col className="text-end">{rezultat.dobandaTotala} RON</Col></Row>
          <Row><Col>% din venit:</Col><Col className="text-end">{rezultat.procentVenit}%</Col></Row>
        </Card>
      )}

      {rezultat && pages.map((pageItems, idx)=>(
        <div key={idx} id={`page-${idx}`} style={{ display: idx===currentPage?"block":"none" }}>
          <Card className="p-4 shadow rounded-4 border-0 mb-4">
            <h5 className="fw-bold text-secondary mb-3">Scadențar luni {idx*ITEMS_PER_PAGE+1}-{Math.min((idx+1)*ITEMS_PER_PAGE, scadentar.length)}</h5>
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
                  {pageItems.map(it=>(
                    <tr key={it.luna}>
                      <td>{it.luna}</td>
                      <td>{it.rata} RON</td>
                      <td>{it.principal} RON</td>
                      <td>{it.dobanda} RON</td>
                      <td>{it.sold} RON</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ))}

      {rezultat && pages.length>1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev onClick={()=>setCurrentPage(p=>Math.max(p-1,0))} disabled={currentPage===0}/>
          {pages.map((_,i)=>(<Pagination.Item key={i} active={i===currentPage} onClick={()=>setCurrentPage(i)}>{i+1}</Pagination.Item>))}
          <Pagination.Next onClick={()=>setCurrentPage(p=>Math.min(p+1,pages.length-1))} disabled={currentPage===pages.length-1}/>
        </Pagination>
      )}

      {rezultat && (
        <div className="text-end mt-3">
          <Button variant="outline-secondary" onClick={exportaPDF}>💾 Salvează PDF</Button>
        </div>
      )}
    </Container>
  );
};

export default SimulareCredit;
