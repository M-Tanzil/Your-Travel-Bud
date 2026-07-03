import { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import UserSidebar from '../../components/common/UserSidebar';

const SettingsPage = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return setMsg({ type: 'danger', text: 'Passwords do not match.' });
    setSaving(true);
    try {
      await userAPI.updateSettings({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setMsg({ type: 'success', text: 'Password updated successfully.' });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to update password.' });
    }
    setSaving(false);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.updateSettings({ email: emailForm.email });
      setMsg({ type: 'success', text: 'Email updated. Please log in again.' });
      setTimeout(logout, 2000);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to update email.' });
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await userAPI.deleteAccount();
      logout();
    } catch {
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">⚙️ Settings</h4>
        {msg && <Alert variant={msg.type} className="py-2 mb-4">{msg.text}</Alert>}

        <Row className="g-4">
          {/* Theme */}
          <Col md={6}>
            <Card className="tb-card p-4">
              <h6 className="fw-bold mb-3">🎨 Appearance</h6>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold">Dark Mode</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Currently: {theme === 'dark' ? 'Dark' : 'Light'}</div>
                </div>
                <Form.Check
                  type="switch"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  id="theme-toggle"
                />
              </div>
            </Card>
          </Col>

          {/* Change Email */}
          <Col md={6}>
            <Card className="tb-card p-4">
              <h6 className="fw-bold mb-3">📧 Change Email</h6>
              <Form onSubmit={handleEmailChange}>
                <Form.Group className="mb-3">
                  <Form.Label>New Email Address</Form.Label>
                  <Form.Control type="email" value={emailForm.email} onChange={(e) => setEmailForm({ email: e.target.value })} placeholder="new@email.com" required />
                </Form.Group>
                <Button type="submit" className="btn-primary btn-sm" disabled={saving}>Update Email</Button>
              </Form>
            </Card>
          </Col>

          {/* Change Password */}
          <Col md={12}>
            <Card className="tb-card p-4">
              <h6 className="fw-bold mb-3">🔒 Change Password</h6>
              <Form onSubmit={handlePasswordChange}>
                <Row className="g-3">
                  <Col sm={4}>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                  </Col>
                  <Col sm={4}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
                  </Col>
                  <Col sm={4}>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} required />
                  </Col>
                </Row>
                <Button type="submit" className="btn-primary btn-sm mt-3" disabled={saving}>Update Password</Button>
              </Form>
            </Card>
          </Col>

          {/* Danger Zone */}
          <Col md={12}>
            <Card className="tb-card p-4" style={{ borderColor: '#fca5a5' }}>
              <h6 className="fw-bold mb-3" style={{ color: '#ef4444' }}>⚠️ Danger Zone</h6>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deleting your account is permanent and cannot be undone. All your trips, bookings, and data will be lost.</p>
              <Button variant="outline-danger" size="sm" onClick={handleDeleteAccount}>Delete My Account</Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SettingsPage;
