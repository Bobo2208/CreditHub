import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterTypeSelect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const prefilledData = location.state || {};

  const handleSelect = (tip) => {
    navigate(`/register/${tip}`, { state: prefilledData });
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-3">Înregistrare</h2>
      <p className="mb-4">Selectează tipul de cont pe care dorești să îl creezi</p>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-3">
          <div
            className="card p-4 shadow-sm border-primary h-100"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("fizic")}
          >
            <div className="fs-1 text-primary mb-2">👤</div>
            <h5>Persoană fizică</h5>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className="card p-4 shadow-sm border-primary h-100"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("juridic")}
          >
            <div className="fs-1 text-primary mb-2">🏢</div>
            <h5>Persoană juridică</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTypeSelect;
