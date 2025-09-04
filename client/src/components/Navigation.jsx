import { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import { Person, CreditCard, BoxArrowRight } from "react-bootstrap-icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

function Navigation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToDashboard = () => {
    if (user?.role === "broker") {
      navigate("/broker-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="d-flex align-items-center gap-2"
        >
          <CreditCard size={24} /> CreditHub
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto justify-content-center gap-3">
            <Nav.Link onClick={() => navigate("/")}>Acasa</Nav.Link>

            <NavDropdown
              title="Credite"
              id="credite-dropdown"
              show={showDropdown}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <NavDropdown.Item onClick={() => navigate("/creditSolutions?tip=fizic")}>
                Persoane Fizice
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/creditSolutions?tip=juridic")}>
                Persoane Juridice
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link onClick={() => navigate("/despre-noi")}>Despre Noi</Nav.Link>
            <Nav.Link onClick={() => navigate("/contact")}>Contact</Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline-dark"
                  onClick={() => navigate("/login")}
                  className="d-flex align-items-center gap-2"
                >
                  <Person /> Login
                </Button>
                <Button
                  variant="outline-dark"
                  onClick={() => navigate("/register/select")}
                  className="d-flex align-items-center gap-2"
                >
                  📝 Înregistrare
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  onClick={goToDashboard}
                  className="d-flex align-items-center gap-2"
                >
                  📋 Dashboard
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2"
                >
                  <BoxArrowRight /> Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
