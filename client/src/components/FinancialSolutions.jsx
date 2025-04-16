import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  CreditCard,
  Lock,
  GraphUpArrow,
  Calendar,
  Clock,
  CurrencyEuro,
} from "react-bootstrap-icons";

const FinancialSolutions = () => {
  return (
    <Row className="bg-white py-5 mx-0">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold">Soluții Financiare Complete</h2>
          <p className="text-muted">
            Oferim o gamă variată de produse de creditare adaptate nevoilor
            tale, cu condiții transparente și avantajoase.
          </p>
        </div>

        {/* First Row of Solutions */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <CreditCard className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Credite Personale</h5>
              <p className="text-muted">
                Soluții rapide și flexibile pentru nevoile tale personale, cu
                dobânzi competitive și termeni avantajoși.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <Lock className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Credite Ipotecare</h5>
              <p className="text-muted">
                Transformă visul casei tale în realitate cu credite ipotecare
                adaptate posibilităților tale financiare.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <GraphUpArrow className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Refinanțare</h5>
              <p className="text-muted">
                Consolidează creditele existente într-o singură rată lunară mai
                avantajoasă și ușor de gestionat.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Second Row of Advantages */}
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <Calendar className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Termeni Flexibili</h5>
              <p className="text-muted">
                Personalizează perioada de rambursare și valoarea ratelor în
                funcție de posibilităție tale financiare.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <Clock className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Aprobare Rapidă</h5>
              <p className="text-muted">
                Proces simplu și rapid de aprobare, cu documentație minimă și
                răspuns în cel mai scurt timp.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <CurrencyEuro className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Fără Comisioane Ascunse</h5>
              <p className="text-muted">
                Transparență totală în costurile creditului, fără taxe sau
                comisioane surpriză pe parcursul contractului.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </Row>
  );
};

export default FinancialSolutions;
