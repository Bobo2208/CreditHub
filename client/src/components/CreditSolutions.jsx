import React, {useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";



const CreditPage = () => {
  const [amount,setAmount] = useState(5000);
  const [months, setMonths] = useState(12);
  const interestRate = 9.49;

  const calculateRate = ()=>{
    const principal = amount;
    const monthlyRate = interestRate/12/100;
    const nrOfMonths = months;

    if(monthlyRate===0){
      return(principal/nrOfMonths.toFixed(2));
    }

    const rate = (principal*monthlyRate*Math.pow(1+monthlyRate,nrOfMonths))/
    (Math.pow(1+monthlyRate,nrOfMonths)-1);

    return rate.toFixed(2);
  }

  const monthlyPayment = calculateRate();
  const totalPayment= (monthlyPayment*months).toFixed(2);


  return (
    <Container fluid className=" bg-light py-5">
      <Row className="justify-content-between align-items-center">
        {/* Secțiunea din stânga */}
        <Col md={6} className="px-4">
          <span className="badge bg-primary text-white opacity-75 px-3 py-2 mb-3">
            🔒 Credite sigure și transparente
          </span>
          <h1 className="fw-bold text-dark">
            Soluții de creditare personalizate pentru fiecare nevoie
          </h1>
          <p className="text-muted">
            Descoperă oferte avantajoase pentru creditele tale personale,
            ipotecare sau de refinanțare, cu aprobare rapidă și dobânzi
            competitive.
          </p>
          <div className="d-flex gap-3">
            <Button variant="primary" size="lg">
              Aplică online acum →
            </Button>
            <Button variant="outline-secondary" size="lg">
              📊 Calculator rate
            </Button>
          </div>
          <Row className="mt-4">
            <Col className="text-center">
              <h4 className="fw-bold">10,000+</h4>
              <p className="text-muted">Clienți mulțumiți</p>
            </Col>
            <Col className="text-center">
              <h4 className="fw-bold">€50M+</h4>
              <p className="text-muted">Credite acordate</p>
            </Col>
            <Col className="text-center">
              <h4 className="fw-bold">92%</h4>
              <p className="text-muted">Rată de aprobare</p>
            </Col>
          </Row>
        </Col>

        {/* Secțiunea din dreapta */}
        <Col md={4} className="mt-5 ms-2">
          <Card className="shadow-lg p-3 rounded-4 border-0" style={{ height: "auto", minHeight: "250px" }}>
            <h4 className="fw-bold text-dark mb-2">Calculator de credite</h4>

            {/* Loan Amount Slider */}
            <Form.Group className="mb-2">
              <Form.Label className="mb-1">Sumă împrumut</Form.Label>
              <Form.Range 
                min={5000} 
                max={100000} 
                step={5000} 
                value={amount} 
                onChange={(e)=>setAmount(parseInt(e.target.value))} 
                style={{ height: "1px" }} 
              />
              <div className="d-flex justify-content-between text-muted">
                <small>5.000 RON</small>
                <small>100.000 RON</small>
              </div>
              <p className="text-center fw-bold mb-1">{amount} RON</p>
            </Form.Group>

            {/* Repayment Period Slider */}
            <Form.Group className="mb-2">
              <Form.Label className="mb-1">Perioada (luni)</Form.Label>
              <Form.Range 
                min={12} 
                max={60} 
                step={1} 
                value={months} 
                onChange={(e)=>setMonths(parseInt(e.target.value))} 
                style={{ height: "1px" }}  
              />
              <div className="d-flex justify-content-between text-muted">
                <small>12 luni</small>
                <small>60 luni</small>
              </div>
              <p className="text-center fw-bold mb-1">{months} luni</p>
            </Form.Group>

            {/* Calculation Results */}
            <Card className="p-2 bg-light rounded-3 border-0 mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted d-block">Rata lunară</small>
                  <h6 className="text-primary fw-bold mb-0">{monthlyPayment} RON</h6>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">Dobândă anuală</small>
                  <h6 className="text-dark mb-0">{interestRate}%</h6>
                </div>
              </div>
              <div className="text-center mt-2">
                <small className="text-muted">Total de plată</small>
                <h6 className="text-dark mb-0">{totalPayment} RON</h6>
              </div>
            </Card>

            {/* Personalized Offer Button */}
            <Button variant="primary" size="lg" className="w-100">
              📈 Obține oferta personalizată
            </Button>

            <p className="text-muted text-center mt-1" style={{ fontSize: "0.7rem" }}>
              Calculele sunt estimative și pot varia
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreditPage;