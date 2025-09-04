import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const RegisterFizic = () => {
  const location = useLocation();
  const prefilled = location.state || {};

  const [form, setForm] = useState({
    nume: prefilled.nume || '',
    prenume: prefilled.prenume || '',
    email: prefilled.email || '',
    telefon: prefilled.telefon || '',
    parola: '',
    cnp: '',
    adresa: '',
    dataNastere: ''
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
    // Name & prenume
    if (!form.nume.trim()) errs.nume = 'Numele este obligatoriu.';
    if (!form.prenume.trim()) errs.prenume = 'Prenumele este obligatoriu.';
    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) errs.email = 'Email invalid.';
    // Telefon (10-14 cifre)
    const phoneRe = /^\d{10,14}$/;
    if (!phoneRe.test(form.telefon)) errs.telefon = 'Telefon invalid (10-14 cifre).';
    // Parola (min 8)
    if (form.parola.length < 8) errs.parola = 'Parola trebuie să aibă minim 8 caractere.';
    // CNP (13 cifre)
    const cnpRe = /^\d{13}$/;
    if (!cnpRe.test(form.cnp)) errs.cnp = 'CNP invalid (13 cifre).';
    // Adresa
    if (form.adresa.trim().length < 5) errs.adresa = 'Adresa prea scurtă.';
    // Data nastere (>=18 ani)
    if (!form.dataNastere) {
      errs.dataNastere = 'Data nașterii este obligatorie.';
    } else {
      const birth = new Date(form.dataNastere);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear() - (today < new Date(birth.setFullYear(today.getFullYear())) ? 1 : 0);
      if (age < 18) errs.dataNastere = 'Trebuie să ai cel puțin 18 ani.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    try {
      const res = await fetch('http://localhost:5000/api/register/fizic', {
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
          <h3 className="card-title text-center mb-4">Înregistrare Persoană Fizică</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  className={`form-control ${errors.nume ? 'is-invalid' : ''}`}
                  name="nume"
                  placeholder="Nume"
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
                  placeholder="Prenume"
                  value={form.prenume}
                  onChange={handleChange}
                  required
                />
                {errors.prenume && <div className="invalid-feedback">{errors.prenume}</div>}
              </div>
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
                className={`form-control ${errors.cnp ? 'is-invalid' : ''}`}
                name="cnp"
                placeholder="CNP"
                value={form.cnp}
                onChange={handleChange}
                required
              />
              {errors.cnp && <div className="invalid-feedback">{errors.cnp}</div>}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${errors.adresa ? 'is-invalid' : ''}`}
                name="adresa"
                placeholder="Adresă"
                value={form.adresa}
                onChange={handleChange}
                required
              />
              {errors.adresa && <div className="invalid-feedback">{errors.adresa}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Data nașterii</label>
              <input
                type="date"
                className={`form-control ${errors.dataNastere ? 'is-invalid' : ''}`}
                name="dataNastere"
                value={form.dataNastere}
                onChange={handleChange}
                required
              />
              {errors.dataNastere && <div className="invalid-feedback">{errors.dataNastere}</div>}
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            <button type="submit" className="btn btn-primary w-100">Înregistrează-te</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterFizic;
