import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import React from 'react'

function Navigation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [showSubDropdown2, setShowSubDropdown2] = useState(false);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top" >
      <Container>
        <Navbar.Brand href="#home">CreditHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto justify-content-center gap-3">
            <Nav.Link href="#acasa">Acasa</Nav.Link>

            <NavDropdown
              title="Credite"
              id="credite-dropdown"
              show={showDropdown}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <NavDropdown
                title="Persoane Fizice"
                id="pfizice-dropdown"
                show={showSubDropdown}
                onMouseEnter={() => setShowSubDropdown(true)}
                onMouseLeave={() => setShowSubDropdown(false)}
              >
                <NavDropdown.Item href="#action/3.3">Credit de nevoi personale</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Credit imobiliare</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Credit auto</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Credit refinantare</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title="Persoane Juridice"
                id="pjuridice-dropdown"
                show={showSubDropdown2}
                onMouseEnter={() => setShowSubDropdown2(true)}
                onMouseLeave={() => setShowSubDropdown2(false)}
              >
                <NavDropdown.Item href="#action/3.3">Credit Pentru Capital De Lucru</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Credit Investitii</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Credit Linii de Finantare</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Leasing</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Factoring</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>

            <Nav.Link href="#about">Despre Noi</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link href="#autentificare">
              <Button variant="outline-dark" className="d-flex align-items-center gap-2">
                <Person /> Autentificare
              </Button>
            </Nav.Link>
            <Nav.Link eventKey={2} href="#aplica">
              <Button variant="primary">Aplică Acum</Button>
            </Nav.Link>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
