import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userAPI.getProfile().then((r) => {
      setProfile(r.data.data);
      setForm({ name: r.data.data.name, bio: r.data.data.bio || '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.updateProfile(form);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setMsg({ type: 'danger', text: 'Failed to update profile.' });
    }
    setSaving(false);
  };

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">👤 My Profile</h4>
        <Row className="g-4">
          <Col md={4}>
            <Card className="tb-card p-4 text-center">
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 1rem' }}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold">{profile?.name}</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{profile?.email}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              {profile?.bio && <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{profile.bio}</p>}
            </Card>
          </Col>
          <Col md={8}>
            <Card className="tb-card p-4">
              <h6 className="fw-bold mb-4">Edit Profile</h6>
              {msg && <Alert variant={msg.type} className="py-2">{msg.text}</Alert>}
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Bio <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span></Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Tell other travellers about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} />
                  <Form.Text>{form.bio.length}/500</Form.Text>
                </Form.Group>
                <Button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;
