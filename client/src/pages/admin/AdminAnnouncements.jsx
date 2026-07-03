import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';

const AdminAnnouncements = () => {
  const [form, setForm] = useState({ subject: '', body: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await adminAPI.sendAnnouncement(form);
      setStatus({ type: 'success', text: res.data.message });
      setForm({ subject: '', body: '' });
    } catch (err) {
      setStatus({ type: 'danger', text: err.response?.data?.message || 'Failed to send announcement.' });
    }
    setSending(false);
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">📢 Send Announcement</h4>
        <Card className="tb-card p-4" style={{ maxWidth: 700 }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            This email will be sent to all active users immediately.
          </p>
          {status && <Alert variant={status.type} className="py-2">{status.text}</Alert>}
          <Form onSubmit={handleSend}>
            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                placeholder="e.g. New cities added to Travel Buddy!"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Message Body *</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Write your announcement here..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
              />
              <Form.Text style={{ color: 'var(--text-secondary)' }}>
                Supports basic HTML (bold, links, paragraphs)
              </Form.Text>
            </Form.Group>
            <div className="d-flex gap-3 align-items-center">
              <Button type="submit" className="btn-primary" disabled={sending}>
                {sending ? '📨 Sending...' : '📢 Send to All Users'}
              </Button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                ⚠️ This will send immediately — cannot be undone
              </span>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
