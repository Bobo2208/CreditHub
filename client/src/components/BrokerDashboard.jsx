import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Alert, Spinner, Form, Row, Col, Pagination } from 'react-bootstrap';

const REJECT_REASONS = [
  'Venit insuficient',
  'Grad de îndatorare prea mare',
  'Documente incomplete',
  'Prea multe credite active'
];

const BrokerDashboard = () => {
  const [broker, setBroker] = useState(null);
  const [stats, setStats] = useState(null);
  const [cereri, setCereri] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [documente, setDocumente] = useState([]);
  const [showCrediteModal, setShowCrediteModal] = useState(false);
  const [crediteActive, setCrediteActive] = useState([]);
  const [clientVenit, setClientVenit] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectCerereId, setRejectCerereId] = useState(null);
  const [rejectClientName, setRejectClientName] = useState('');
  const [rejectReasons, setRejectReasons] = useState([]);
  const [rejectCustomReason, setRejectCustomReason] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboard();
  }, [token, user?.id, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const fetchDashboard = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [brokerRes, statsRes, cereriRes] = await Promise.all([
        fetch(`http://localhost:5000/api/broker/me?id=${user.id}`, { headers }),
        fetch(`http://localhost:5000/api/broker/dashboard-stats`, { headers }),
        fetch(`http://localhost:5000/api/cereri/all`, { headers })
      ]);
      if (!brokerRes.ok || !statsRes.ok || !cereriRes.ok) throw new Error('Eroare la inițializare');
      setBroker(await brokerRes.json());
      setStats(await statsRes.json());
      let data = await cereriRes.json();
      
      data.sort((a, b) => {
        const statusPriority = { 'in_asteptare': 0, 'aprobata': 1, 'respinsa': 2 };
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      if (filter !== 'all') data = data.filter(c => c.status === filter);
      setCereri(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Eroare la încărcarea dashboardului.');
    }
  };

  const aprobaCerere = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cereri/aproba/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Aprobarea a eșuat');
      fetchDashboard();
    } catch (err) {
      console.error('Aprobă error:', err);
      setError('Nu s-a putut aproba cererea.');
    }
  };

  const openRejectModal = (c) => {
    setRejectCerereId(c.idCerere);
    setRejectClientName(c.numeClient);
    setRejectReasons([]);
    setRejectCustomReason('');
    setShowRejectModal(true);
  };

  const handleReasonToggle = (reason) => {
    setRejectReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleRejectConfirm = async () => {
    try {
      const payload = { reasons: rejectReasons, comment: rejectCustomReason };
      const res = await fetch(`http://localhost:5000/api/cereri/respinge/${rejectCerereId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Respingerea a eșuat');
      setShowRejectModal(false);
      fetchDashboard();
    } catch (err) {
      console.error('Respinge error:', err);
      setError('Nu s-a putut respinge cererea.');
    }
  };

  const viewDocumente = async (clientId, clientName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/documente/client/${clientId}`, { headers: { Authorization: `Bearer ${token}` } });
      setDocumente(await res.json());
      setSelectedClientId(clientId);
      setSelectedClientName(clientName);
      setShowDocsModal(true);
    } catch (err) {
      console.error('Doc error:', err);
    }
  };

  const viewCrediteActive = async (clientId, clientName) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [credRes, profRes] = await Promise.all([
        fetch(`http://localhost:5000/api/credite/active/${clientId}`, { headers }),
        fetch(`http://localhost:5000/api/profil/client/${clientId}`, { headers })
      ]);
      const credData = await credRes.json();
      const profData = await profRes.json();
      setCrediteActive(credData);
      setClientVenit(profData.venitLunar);
      setSelectedClientId(clientId);
      setSelectedClientName(clientName);
      setShowCrediteModal(true);
    } catch (err) {
      console.error('Credite active error:', err);
      setError('Nu s-au putut încărca creditele active.');
    }
  };

  const totalPages = Math.ceil(cereri.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCereri = cereri.slice(startIndex, endIndex);

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
            {i}
          </Pagination.Item>
        );
      }
    } else {
      items.push(<Pagination.Item key={1} active={1 === currentPage} onClick={() => setCurrentPage(1)}>1</Pagination.Item>);
      if (currentPage > 3) items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
            {i}
          </Pagination.Item>
        );
      }
      if (currentPage < totalPages - 2) items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      items.push(<Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => setCurrentPage(totalPages)}>{totalPages}</Pagination.Item>);
    }
    return items;
  };

  if (!broker || !stats) return <Spinner animation="border" className="mt-5" />;

  return (
    <div className="container mt-4">
      <h2>Bun venit, {broker.nume} {broker.prenume}</h2>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      <Row className="mt-4 mb-4">
        <Col md={3}><Card className="text-center h-100"><Card.Body><Card.Title className="h5">Cereri totale</Card.Title><Card.Text className="h4 text-primary">{stats.totalCereri}</Card.Text></Card.Body></Card></Col>
        <Col md={3}><Card className="text-center h-100"><Card.Body><Card.Title className="h5">În așteptare</Card.Title><Card.Text className="h4 text-warning">{stats.cereriAsteptare}</Card.Text></Card.Body></Card></Col>
        <Col md={3}><Card className="text-center h-100"><Card.Body><Card.Title className="h5">Aprobate</Card.Title><Card.Text className="h4 text-success">{stats.cereriAprobate}</Card.Text></Card.Body></Card></Col>
        <Col md={3}><Card className="text-center h-100"><Card.Body><Card.Title className="h5">Respinse</Card.Title><Card.Text className="h4 text-danger">{stats.cereriRespinse}</Card.Text></Card.Body></Card></Col>
      </Row>

      <Row className="justify-content-between align-items-center mb-3">
        <Col><h4>Cereri clienți</h4></Col>
        <Col md={3}><Form.Select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Toate</option><option value="in_asteptare">În așteptare</option><option value="aprobata">Aprobate</option><option value="respinsa">Respinse</option></Form.Select></Col>
      </Row>

      {cereri.length > 0 && <div className="mb-3"><small className="text-muted">Afișează {startIndex+1}-{Math.min(endIndex, cereri.length)} din {cereri.length} cereri</small></div>}

      {cereri.length === 0 ? (
        <Alert variant="info">Nu există cereri.</Alert>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Client</th>
                <th>Suma</th>
                <th>Tip credit</th>
                <th>Status</th>
                <th>Documente</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {currentCereri.map(c => (
                <tr key={c.idCerere}>
                  <td><Button variant="link" onClick={() => viewCrediteActive(c.idClient, c.numeClient)}>{c.numeClient}</Button></td>
                  <td>{c.sumaSolicitata} RON</td>
                  <td>{c.tipCredit}</td>
                  <td><span className={`badge ${c.status==='in_asteptare'?'bg-warning':c.status==='aprobata'?'bg-success':'bg-danger'}`}>{c.status}</span></td>
                  <td><Button variant="outline-primary" size="sm" onClick={() => viewDocumente(c.idClient, c.numeClient)}>Vezi</Button></td>
                  <td>
                    {c.status === 'in_asteptare' ? (
                      <><Button variant="success" size="sm" onClick={() => aprobaCerere(c.idCerere)} className="me-2">Aprobă</Button><Button variant="danger" size="sm" onClick={() => openRejectModal(c)}>Respinge</Button></>
                    ) : (<span className="text-muted">Finalizată</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage===1} />
                <Pagination.Prev onClick={() => setCurrentPage(prev=>Math.max(1, prev-1))} disabled={currentPage===1} />
                {generatePaginationItems()}
                <Pagination.Next onClick={() => setCurrentPage(prev=>Math.min(totalPages, prev+1))} disabled={currentPage===totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage===totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}

      <Modal show={showDocsModal} onHide={() => setShowDocsModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Documente client: {selectedClientName}</Modal.Title></Modal.Header>
        <Modal.Body>
          {!documente.length ? <p>Nu sunt documente.</p> : (
            <ul>{documente.map((doc,i)=><li key={i}><a href={`http://localhost:5000/${doc.fisierPath}`} target="_blank" rel="noopener noreferrer">{doc.tipDocument}</a></li>)}</ul>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showCrediteModal} onHide={() => setShowCrediteModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Credite active client: {selectedClientName}</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Venit lunar: {clientVenit ? `${clientVenit} RON` : '-'}</p>
          {!crediteActive.length ? <p>Nu sunt credite active.</p> : (
            <Table striped bordered hover>
              <thead><tr><th>#</th><th>Sumă</th><th>Rată</th><th>% din venit</th><th>Dobândă</th><th>Durată</th><th>Data start</th></tr></thead>
              <tbody>{crediteActive.map((cr,idx)=>{
                  const procent = clientVenit ? ((cr.rata/clientVenit)*100).toFixed(1) : '-';
                  return <tr key={idx}><td>{idx+1}</td><td>{cr.suma?.toFixed(2)} RON</td><td>{cr.rata?.toFixed(2)} RON</td><td>{procent}%</td><td>{cr.dobanda}%</td><td>{cr.durata} luni</td><td>{new Date(cr.dataStart).toLocaleDateString('ro-RO')}</td></tr>;
              })}</tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton><Modal.Title>Reține motiv respingere: {rejectClientName}</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Selectează motive:</p>
          {REJECT_REASONS.map((r,i)=>(<Form.Check key={i} type="checkbox" label={r} checked={rejectReasons.includes(r)} onChange={()=>handleReasonToggle(r)} className="mb-1" />))}
          <Form.Group className="mt-3" controlId="customReason">
            <Form.Label>Alt motiv (opțional)</Form.Label>
            <Form.Control as="textarea" rows={3} value={rejectCustomReason} onChange={e=>setRejectCustomReason(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowRejectModal(false)}>Anulează</Button>
          <Button variant="danger" onClick={handleRejectConfirm}>Confirmă respingere</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BrokerDashboard;
