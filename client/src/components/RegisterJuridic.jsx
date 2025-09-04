import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const RegisterJuridic = () => {
  const location = useLocation();
  const prefilled = location.state || {};

  const [form, setForm] = useState({
    denumire: '',      
    email: prefilled.email || '',
    telefon: prefilled.telefon || '',
    parola: '',
    cui: '',
    adresa: '',
    nume: prefilled.nume || '',
    prenume: prefilled.prenume || ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage('');
  };

  const validate = () => {
    const errs = {};
    // Reprezentant
    if (!form.nume.trim()) errs.nume = 'Numele reprezentantului este obligatoriu.';
    if (!form.prenume.trim()) errs.prenume = 'Prenumele reprezentantului este obligatoriu.';
    // Denumire firma
    if (form.denumire.trim().length < 3) errs.denumire = 'Denumirea firmei este prea scurtă.';
    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) errs.email = 'Email invalid.';
    // Telefon
    const phoneRe = /^\d{10,14}$/;
    if (!phoneRe.test(form.telefon)) errs.telefon = 'Telefon invalid (10-14 cifre).';
    // Parola
    if (form.parola.length < 8) errs.parola = 'Parola trebuie să aibă minim 8 caractere.';
    // CUI (2-10 cifre)
    const cuiRe = /^\d{2,10}$/;
    if (!cuiRe.test(form.cui)) errs.cui = 'CUI invalid.';
    // Adresa
    if (form.adresa.trim().length < 5) errs.adresa = 'Adresa prea scurtă.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    try {
      const res = await fetch('http://localhost:5000/api/register/juridic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      setMessage('Eroare la trimitere.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Înregistrare Persoană Juridică</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  className={`form-control ${errors.nume ? 'is-invalid' : ''}`}
                  name="nume"
                  placeholder="Nume reprezentant"
                  value={form.nume}
                  onChange={handleChange}
                  required
                />
                {errors.nume && <div className="invalid-feedback">{errors.nume}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  className={`form-control ${errors.prenume ? 'is-invalid' : ''}`}
                  name="prenume"
                  placeholder="Prenume reprezentant"
                  value={form.prenume}
                  onChange={handleChange}
                  required
                />
                {errors.prenume && <div className="invalid-feedback">{errors.prenume}</div>}
              </div>
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${errors.denumire ? 'is-invalid' : ''}`}
                name="denumire"
                placeholder="Denumire firmă"
                value={form.denumire}
                onChange={handleChange}
                required
              />
              {errors.denumire && <div className="invalid-feedback">{errors.denumire}</div>}
            </div>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${errors.telefon ? 'is-invalid' : ''}`}
                name="telefon"
                placeholder="Telefon"
                value={form.telefon}
                onChange={handleChange}
                required
              />
              {errors.telefon && <div className="invalid-feedback">{errors.telefon}</div>}
            </div>
            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.parola ? 'is-invalid' : ''}`}
                name="parola"
                placeholder="Parolă"
                value={form.parola}
                onChange={handleChange}
                required
              />
              {errors.parola && <div className="invalid-feedback">{errors.parola}</div>}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${errors.cui ? 'is-invalid' : ''}`}
                name="cui"
                placeholder="CUI"
                value={form.cui}
                onChange={handleChange}
                required
              />
              {errors.cui && <div className="invalid-feedback">{errors.cui}</div>}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${errors.adresa ? 'is-invalid' : ''}`}
                name="adresa"
                placeholder="Adresă sediu"
                value={form.adresa}
                onChange={handleChange}
                required
              />
              {errors.adresa && <div className="invalid-feedback">{errors.adresa}</div>}
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            <button type="submit" className="btn btn-primary w-100">Înregistrează-te</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterJuridic;
