import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { blogAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';

const BlogWritePage = () => {
  const { id } = useParams(); // for edit mode
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', destination: '', content: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      blogAPI.getOne(id).then((r) => {
        const b = r.data.data;
        setForm({ title: b.title, destination: b.destination, content: b.content });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await blogAPI.update(id, form);
      } else {
        await blogAPI.create(form);
      }
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog post.');
    }
    setSaving(false);
  };

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">{id ? '✏️ Edit Story' : '✍️ Write a Travel Story'}</h4>
        <Card className="tb-card p-4" style={{ maxWidth: 800 }}>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                placeholder="e.g. 5 Days in Rajasthan — A Journey Through History"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                maxLength={200}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destination *</Form.Label>
              <Form.Control
                placeholder="e.g. Jaipur, India"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Your Story *</Form.Label>
              <Form.Control
                as="textarea"
                rows={16}
                placeholder="Share your travel experience, tips, hidden gems you discovered..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                style={{ resize: 'vertical' }}
              />
              <Form.Text style={{ color: 'var(--text-secondary)' }}>{form.content.length} characters</Form.Text>
            </Form.Group>
            <div className="d-flex gap-3">
              <Button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Publishing...' : id ? 'Save Changes' : 'Publish Story'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/blogs')}>Cancel</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default BlogWritePage;
