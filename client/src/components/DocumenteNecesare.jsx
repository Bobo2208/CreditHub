import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  PersonBadge,
  Receipt,
  FileEarmarkText,
  FileEarmarkPdf,
  FileEarmarkWord,
  FileEarmarkExcel
} from "react-bootstrap-icons";

const Documentatie = () => {
  const docs = [
    {
      title: "Buletin / Carte de identitate",
      icon: <PersonBadge size={32} />,
      desc: "Copie față-verso a actului de identitate (PDF/JPG). Denumește-l “CI_NumePrenume.pdf”."
    },
    {
      title: "Adeverință de venit",
      icon: <Receipt size={32} />,
      desc: "Adeverință semnată și ștampilată de angajator (PDF/JPG)."
    },
    {
      title: "Cerere de credit",
      icon: <FileEarmarkText size={32} />,
      desc: "Formular completat, descărcabil din contul tău sau primit de la broker."
    },
    {
      title: "Extras de cont",
      icon: <FileEarmarkExcel size={32} />,
      desc: "Extras bancar cu IBAN și ultimele 3 luni (PDF/XLS)."
    },
    {
      title: "Contract de muncă",
      icon: <FileEarmarkWord size={32} />,
      desc: "Copie a contractului actual (DOC/DOCX/PDF)."
    },
    {
      title: "Altele",
      icon: <FileEarmarkPdf size={32} />,
      desc: "Orice alt document relevant (max. 10 MB, PDF/JPG/PNG/DOCX)."
    }
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Documentație Necesară</h2>
        <p className="text-muted">
          Pentru a procesa cererea ta de credit, încarcă documentele de mai jos conform specificațiilor.
        </p>
      </div>

      <Row className="g-4">
        {docs.map((doc, idx) => (
          <Col key={idx} md={6} lg={4}>
            <Card className="h-100 border-0 text-center p-4 shadow-sm d-flex flex-column">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  {React.cloneElement(doc.icon, { className: "text-primary" })}
                </div>
              </div>
              <h5 className="fw-bold mb-2">{doc.title}</h5>
              <p className="text-muted mb-0 flex-grow-1">{doc.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Documentatie;
