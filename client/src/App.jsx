import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./components/HomeScreen";
import CreditSolutionsPage from "./components/CreditSolutionPage";
import Login from "./components/Login";
import RegisterFizic from "./components/RegisterFizic";
import RegisterJuridic from "./components/RegisterJuridic";
import RegisterTypeSelect from "./components/RegisterTypeSelect";
import CreditConsultation from "./components/Consultations";
import DespreNoi from "./components/DespreNoi";
import Contact from "./components/Contact";
import SimulareCredit from "./components/SimulareCredit";
import Termeni from "./components/Termeni";
import Confidentialitate from "./components/Confidentialitate";
import ResetareParola from "./components/ResetareParola";
import { AuthProvider } from "./components/AuthContext";
import Dashboard from "./components/Dashboard";
import SetareParolaNoua from "./components/SetareParolaNoua";
import DocumentUpload from "./components/DocumenteUpload";
import ContulMeu from "./components/ContulMeu";
import CereriClient from "./components/CereriClient";
import CrediteClient from "./components/CrediteClient";
import ProfilClient from "./components/ProfilClient";
import VerificareEligibilitate from "./components/VerificareEligibilitate";
import BrokerLogin from "./components/BrokerLogin";
import BrokerRegister from "./components/BrokerRegister";
import BrokerDashboard from "./components/BrokerDashboard";
import CerinteDocumente from "./components/DocumenteNecesare";
import ChatPopup from "./components/ChatPopup";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-fill" style={{ paddingTop: "72px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/creditSolutions" element={<CreditSolutionsPage />} />
              <Route path="/consultatie" element={<CreditConsultation />} />
              <Route path="/despre-noi" element={<DespreNoi />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/simulare" element={<SimulareCredit />} />
              <Route path="/termeni" element={<Termeni />} />
              <Route path="/confidentialitate" element={<Confidentialitate />} />
              <Route path="/documentatie" element={<CerinteDocumente />} />
              <Route path="/login" element={<Login />} />
              <Route path="/broker-login" element={<BrokerLogin />} />
              <Route path="/broker-register" element={<BrokerRegister />} />
              <Route path="/resetare-parola" element={<ResetareParola />} />
              <Route path="/setare-parola" element={<SetareParolaNoua />} />
              <Route path="/register/select" element={<RegisterTypeSelect />} />
              <Route path="/register/fizic" element={<RegisterFizic />} />
              <Route path="/register/juridic" element={<RegisterJuridic />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contul-meu" element={<ContulMeu />} />
                <Route path="/cereri-credit" element={<CereriClient />} />
                <Route path="/credite" element={<CrediteClient />} />
                <Route path="/profil" element={<ProfilClient />} />
                <Route path="/eligibilitate" element={<VerificareEligibilitate />} />
                <Route path="/documente/upload" element={<DocumentUpload />} />
                <Route path="/broker-dashboard" element={<BrokerDashboard />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ChatPopup />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
