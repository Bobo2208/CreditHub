import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const systemPrompt = `
# CreditHub Assistant - Prompt Complet

Ești asistentul virtual și consultantul financiar exclusiv al aplicației **CreditHub**. Misiunea ta este să promovezi și să ghidezi utilizatorii către soluțiile de credit oferite DOAR de CreditHub.

## 🎯 OBIECTIVUL PRINCIPAL
Convertește fiecare interacțiune în oportunitate de vânzare pentru produsele CreditHub prin:
- Ghidarea pas cu pas prin aplicație
- Recomandări personalizate de credite CreditHub
- Direcționarea către aplicarea online IMEDIATĂ

## 🔄 INSTRUCȚIUNI DE NAVIGARE STRICTE
Dacă utilizatorul cere să fie navigat într-o pagină, răspunde DOAR cu comanda: NAVIGATE:/cale și NIMIC ALTCEVA.

## 🚩 RUTELE APLICAȚIEI CREDITHUB
/home - pagina principală
/creditSolutions - toate produsele de credit
/despre-noi - informații despre CreditHub
/contact - suport și contact
/simulare - simulator de credite
/termeni - termeni și condiții
/confidentialitate - politica de confidențialitate
/documentatie - ghiduri și ajutor
/login - autentificare client
/broker-login - autentificare broker
/broker-register - înregistrare broker
/resetare-parola - resetare parolă
/setare-parola - setare parolă nouă
/register/select - selectare tip înregistrare
/register/fizic - înregistrare persoană fizică
/register/juridic - înregistrare persoană juridică
/dashboard - panoul principal al clientului
/contul-meu - setări cont
/cereri-credit - vizualizare cereri de credit
/credite - istoric credite
/profil - profil client
/eligibilitate - verificare eligibilitate
/documente/upload - încărcare documente
/broker-dashboard - panoul principal al brokerului

`.trim();

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "system", text: systemPrompt }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const history = [...messages, { role: "user", text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      console.log("User message sent:", text);
      const res = await fetch("http://localhost:5000/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        setMessages(h => [...h, { role: "assistant", text: "Îmi pare rău, serverul nu răspunde. Te rog încearcă din nou." }]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      let reply = data.text;
      console.log("AI reply raw:", reply);

      if (typeof reply !== 'string') {
        setMessages(h => [...h, { role: "assistant", text: "Îmi pare rău, nu am primit un răspuns valid." }]);
        setLoading(false);
        return;
      }

      const navMatch = reply.match(/NAVIGATE:\/[-a-z0-9]+/i);
      if (navMatch) {
        const path = navMatch[0].slice("NAVIGATE:".length).trim();
        console.log("Navigating to", path);
        setLoading(false);
        navigate(path);
        setMessages(h => [...h, { role: "assistant", text: `🔄 Te redirecționez către ${path}` }]);
        return;
      }

      setMessages(h => [...h, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(h => [...h, { role: "assistant", text: "Îmi pare rău, am întâmpinat o eroare tehnică. Te rog încearcă din nou." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!open && (
        <Button
          variant="primary"
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            borderRadius: "50%",
            width: 60,
            height: 60,
            fontSize: 24,
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          💬
        </Button>
      )}

      {open && (
        <Card
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 350,
            height: 450,
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          <Card.Header 
            className="d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "#0d6efd", color: "white" }}
          >
            <span>🤖 Asistent Credit</span>
            <Button 
              size="sm" 
              variant="outline-light" 
              onClick={() => setOpen(false)}
              style={{ 
                border: "none", 
                fontSize: "18px",
                padding: "2px 8px"
              }}
            >
              ✕
            </Button>
          </Card.Header>
          
          <Card.Body style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: '0.75rem',
            backgroundColor: "#f8f9fa"
          }}>
            {messages.filter(m => m.role !== 'system').map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === 'user' ? 'right' : 'left',
                  margin: '0.5rem 0'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: 16,
                    backgroundColor: m.role === 'user' ? '#0d6efd' : '#ffffff',
                    color: m.role === 'user' ? '#fff' : '#000',
                    maxWidth: '85%',
                    wordWrap: 'break-word',
                    boxShadow: m.role === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                    border: m.role === 'user' ? 'none' : '1px solid #e9ecef'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: 'left', margin: '0.5rem 0' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: 16,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e9ecef'
                }}>
                  <Spinner animation="border" size="sm" /> Gândesc...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </Card.Body>
          
          <Card.Footer className="d-flex" style={{ padding: '0.5rem' }}>
            <Form.Control
              type="text"
              placeholder="Scrie un mesaj..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ 
                borderRadius: "20px", 
                border: "1px solid #ced4da",
                marginRight: "0.5rem"
              }}
            />
            <Button 
              variant="primary" 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              style={{ 
                borderRadius: "20px",
                minWidth: "50px"
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "📤"}
            </Button>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}
