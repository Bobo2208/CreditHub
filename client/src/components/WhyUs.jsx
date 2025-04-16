import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  Calculator,
  Lightning,
  FileEarmarkText,
  ShieldCheck,
} from "react-bootstrap-icons";

const WhyUs = () => {
  return (
    <Row className="bg-white py-5 mx-0">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold">De Ce Să Alegi CreditHub</h2>
          <p className="text-muted">
            Suntem dedicaţi să-ţi oferim cele mai bune soluţii de finanţare, cu
            un proces simplu, transparent şi adaptat nevoilor tale.
          </p>
        </div>

        {/* Features Row */}
        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm d-flex flex-column">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <Calculator className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Calculator de Credit</h5>
              <p className="text-muted mb-3 flex-grow-1">
                Estimează rata lunară şi costul total al creditului în funcţie
                de suma dorită şi perioada de rambursare.
              </p>
              <Button
                variant="link"
                className="text-primary p-0 fw-bold text-decoration-none mt-auto align-self-center"
              >
                Calculează acum →
              </Button>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm d-flex flex-column">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <Lightning className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Aprobare Rapidă</h5>
              <p className="text-muted mb-3 flex-grow-1">
                Procesăm cererea ta de credit în cel mai scurt timp posibil,
                oferindu-ţi un răspuns în 24-48 de ore.
              </p>
              <Button
                variant="link"
                className="text-primary p-0 fw-bold text-decoration-none mt-auto align-self-center"
              >
                Verifică eligibilitatea →
              </Button>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm d-flex flex-column">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FileEarmarkText className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Documentaţie Simplificată</h5>
              <p className="text-muted mb-3 flex-grow-1">
                Am simplificat procesul de aplicare, solicitând doar documentele
                esenţiale pentru aprobarea creditului tău.
              </p>
              <Button
                variant="link"
                className="text-primary p-0 fw-bold text-decoration-none mt-auto align-self-center"
              >
                Vezi documentele necesare →
              </Button>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm d-flex flex-column">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <ShieldCheck className="text-primary" size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-3">Siguranţă şi Transparenţă</h5>
              <p className="text-muted mb-3 flex-grow-1">
                Îţi prezentăm toate costurile şi condiţiile încă de la început,
                fără comisioane sau clauze ascunse.
              </p>
              <Button
                variant="link"
                className="text-primary p-0 fw-bold text-decoration-none mt-auto align-self-center"
              >
                Află mai multe →
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </Row>
  );
};

export default WhyUs;
