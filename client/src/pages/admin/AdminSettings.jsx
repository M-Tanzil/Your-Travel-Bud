import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    adminAPI.getSettings().then((r) => setSettings(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleSave = async (section, data) => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await adminAPI.updateSettings({ ...settings, ...data });
      setSettings(res.data.data);
      setMsg({ type: 'success', text: 'Settings saved successfully.' });
    } catch {
      setMsg({ type: 'danger', text: 'Failed to save settings.' });
    }
    setSaving(false);
  };

  const addFaq = () => {
    const updated = [...(settings.faq || []), { question: '', answer: '', order: settings.faq?.length || 0 }];
    setSettings({ ...settings, faq: updated });
  };

  const removeFaq = (i) => {
    const updated = settings.faq.filter((_, idx) => idx !== i);
    setSettings({ ...settings, faq: updated });
  };

  const updateFaq = (i, key, val) => {
    const updated = [...settings.faq];
    updated[i][key] = val;
    setSettings({ ...settings, faq: updated });
  };

  if (loading) return <div className="dashboard-layout"><AdminSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">⚙️ Platform Settings</h4>
        {msg && <Alert variant={msg.type} className="py-2 mb-4">{msg.text}</Alert>}

        <Tab.Container defaultActiveKey="general">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item><Nav.Link eventKey="general">General</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="refunds">Refund Policies</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="faq">FAQ</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="content">Page Content</Nav.Link></Nav.Item>
          </Nav>

          <Tab.Content>
            {/* General */}
            <Tab.Pane eventKey="general">
              <Card className="tb-card p-4" style={{ maxWidth: 600 }}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control type="email" value={settings.contactEmail || ''} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
                </Form.Group>
                <Button className="btn-primary" onClick={() => handleSave('general', {})} disabled={saving}>Save General Settings</Button>
              </Card>
            </Tab.Pane>

            {/* Refund Policies */}
            <Tab.Pane eventKey="refunds">
              <Card className="tb-card p-4">
                {['hotel', 'train', 'bus'].map((type) => (
                  <div key={type} className="mb-4">
                    <h6 className="fw-bold mb-3 text-capitalize">🔄 {type} Refund Policy</h6>
                    <Row className="g-3">
                      <Col sm={4}>
                        <Form.Label style={{ fontSize: '0.85rem' }}>Full Refund (days before)</Form.Label>
                        <Form.Control
                          type="number"
                          value={settings.refundPolicies?.[type]?.fullRefundDays || 0}
                          onChange={(e) => setSettings({ ...settings, refundPolicies: { ...settings.refundPolicies, [type]: { ...settings.refundPolicies?.[type], fullRefundDays: +e.target.value } } })}
                        />
                      </Col>
                      <Col sm={4}>
                        <Form.Label style={{ fontSize: '0.85rem' }}>Partial Refund (days before)</Form.Label>
                        <Form.Control
                          type="number"
                          value={settings.refundPolicies?.[type]?.partialRefundDays || 0}
                          onChange={(e) => setSettings({ ...settings, refundPolicies: { ...settings.refundPolicies, [type]: { ...settings.refundPolicies?.[type], partialRefundDays: +e.target.value } } })}
                        />
                      </Col>
                      <Col sm={4}>
                        <Form.Label style={{ fontSize: '0.85rem' }}>Partial Refund %</Form.Label>
                        <Form.Control
                          type="number"
                          value={settings.refundPolicies?.[type]?.partialRefundPercent || 0}
                          onChange={(e) => setSettings({ ...settings, refundPolicies: { ...settings.refundPolicies, [type]: { ...settings.refundPolicies?.[type], partialRefundPercent: +e.target.value } } })}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Button className="btn-primary" onClick={() => handleSave('refunds', {})} disabled={saving}>Save Refund Policies</Button>
              </Card>
            </Tab.Pane>

            {/* FAQ */}
            <Tab.Pane eventKey="faq">
              <Card className="tb-card p-4">
                {(settings.faq || []).map((faq, i) => (
                  <div key={i} className="mb-4 p-3" style={{ border: '1px solid var(--border)', borderRadius: 8 }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>FAQ #{i + 1}</span>
                      <button onClick={() => removeFaq(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕ Remove</button>
                    </div>
                    <Form.Control className="mb-2" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} />
                    <Form.Control as="textarea" rows={2} placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} />
                  </div>
                ))}
                <div className="d-flex gap-3">
                  <button onClick={addFaq} className="btn btn-outline-primary btn-sm">+ Add FAQ</button>
                  <Button className="btn-primary btn-sm" onClick={() => handleSave('faq', {})} disabled={saving}>Save FAQ</Button>
                </div>
              </Card>
            </Tab.Pane>

            {/* Page Content */}
            <Tab.Pane eventKey="content">
              <Card className="tb-card p-4">
                <Form.Group className="mb-3">
                  <Form.Label>About Us Content</Form.Label>
                  <Form.Control as="textarea" rows={5} value={settings.aboutUs || ''} onChange={(e) => setSettings({ ...settings, aboutUs: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Terms of Service</Form.Label>
                  <Form.Control as="textarea" rows={5} value={settings.termsOfService || ''} onChange={(e) => setSettings({ ...settings, termsOfService: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Privacy Policy</Form.Label>
                  <Form.Control as="textarea" rows={5} value={settings.privacyPolicy || ''} onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })} />
                </Form.Group>
                <Button className="btn-primary" onClick={() => handleSave('content', {})} disabled={saving}>Save Content</Button>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default AdminSettings;
