import Navigation from "./Navigation"
import CreditSolutions from "./CreditSolutions";
import 'bootstrap/dist/css/bootstrap.min.css'
import FinancialSolutions from "./FinancialSolutions";
import WhyUs from "./WhyUs";
import CreditConsultation from "./Consultations";
import Footer from "./Footer";


function Home() {
  return (
    <div>
    <Navigation />
    <CreditSolutions />
    <FinancialSolutions />
    <WhyUs />
    <CreditConsultation/>
    <Footer/>
    </div>
  )
}

export default Home;
