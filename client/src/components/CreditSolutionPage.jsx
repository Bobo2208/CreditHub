import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const CreditSolutionsPage = () => {
  const [tipuri, setTipuri] = useState([]);
  const [tipClient, setTipClient] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const descrieri = {
    "Credit Personal": "Un credit flexibil, ideal pentru cheltuieli neprevăzute, vacanțe sau alte nevoi personale.",
    "Credit Auto": "Destinat achiziționării unui autoturism nou sau second-hand, cu dobânzi competitive.",
    "Credit Imobiliar": "Perfect pentru achiziția unei locuințe sau pentru construcții, pe termen lung.",
    "Credit Rapid": "Credit aprobat în timp scurt, pentru situații urgente sau cheltuieli neașteptate.",
    "Refinantare": "Reunește toate creditele într-o singură rată lunară, mai simplu de gestionat.",
    "Leasing": "Soluție financiară pentru bunuri mobile (ex: mașini), fără avans mare.",
    "Credit Studii": "Sprijin pentru studenți – taxe de școlarizare, materiale didactice sau mobilitate.",
    "Credit Agricultura": "Finanțare specială pentru agricultori, echipamente sau dezvoltarea afacerii agricole.",
    "Credit Start-Up": "Credite pentru afaceri noi – investiții inițiale, echipamente sau cash flow.",
    "Credit Verde": "Susține achiziția de echipamente ecologice sau locuințe eficiente energetic."
  };

  const getDescriere = (tipCreditKey) => descrieri[tipCreditKey] || "Acest tip de credit este disponibil pentru diverse nevoi financiare.";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipDinUrl = params.get("tip");
    if (tipDinUrl === "fizic" || tipDinUrl === "juridic") {
      setTipClient(tipDinUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (tipClient) {
      fetch(`http://localhost:5000/api/tipuricredite/by-client-type/${tipClient}`)
        .then((res) => res.json())
        .then((data) => setTipuri(data))
        .catch((err) => console.error("Eroare la fetch:", err));
    }
  }, [tipClient]);

  const handleApplyClick = (tip) => {
    if (!user) {
      setError("");
      navigate('/login');
      window.scrollTo(0, 0);
      return;
    }
    if (user.role === 'broker') {
      setError('Brokerii nu pot solicita un credit de pe acest cont.');
      return;
    }
    navigate(`/cereri-credit?tip=${tip.idTipCredit}`);
  };

  return (
    <div>
      <div className="container py-5 mt-5">
        <h2 className="text-center fw-bold mb-4">💼 Tipuri de credite disponibile</h2>
        <div className="mb-3 text-center text-danger">{error}</div>
        <div className="mb-5 text-center">
          <label className="form-label me-3 fw-semibold">Selectează tipul de client:</label>
          <select
            className="form-select d-inline-block w-auto"
            onChange={(e) => setTipClient(e.target.value)}
            value={tipClient}
          >
            <option value="">-- Alege tipul de client --</option>
            <option value="fizic">Persoană Fizică</option>
            <option value="juridic">Persoană Juridică</option>
          </select>
        </div>

        {tipuri.length > 0 ? (
          tipuri.map((tip) => (
            <div key={tip.idTipCredit} className="card mb-4 border-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold mb-3">{tip.numeCredit}</h5>
                <p className="text-muted mb-3">{getDescriere(tip.numeCredit)}</p>
                <div className="mb-2">
                  <span className="fw-semibold">Sume:</span> {tip.sumaMinima} RON – {tip.sumaMaxima} RON
                </div>
                <div>
                  <span className="fw-semibold">Dobândă:</span> {tip.dobandaMinima}% – {tip.dobandaMaxima}%
                </div>
                <div className="mt-4">
                  <button
                    className="btn btn-primary px-4"
                    onClick={() => handleApplyClick(tip)}
                  >
                    Aplică acum
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          tipClient && (
            <p className="text-center text-muted">
              Nu există tipuri de credite pentru acest tip de client.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default CreditSolutionsPage;
