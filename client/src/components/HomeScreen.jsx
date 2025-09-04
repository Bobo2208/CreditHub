import CreditSolutions from "./CreditSolutions";
import 'bootstrap/dist/css/bootstrap.min.css'
import FinancialSolutions from "./FinancialSolutions";
import WhyUs from "./WhyUs";
import CreditConsultation from "./Consultations";


function Home() {
  return (
    <div>
    
    <CreditSolutions />
    <FinancialSolutions />
    <WhyUs />
    <CreditConsultation/>
    
    </div>
  )
}

export default Home;
