import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="page-wrapper d-flex align-items-center py-5" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 460 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'var(--primary)', fontSize: '2rem' }}>✈️ Travel Buddy</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your free account and start exploring</p>
        </div>
        <Card className="tb-card p-4">
          <h4 className="mb-4 fw-bold">Create account</h4>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" className="w-100 btn-primary py-2 mt-1" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Form>
          <hr />
          <p className="text-center mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" className="fw-semibold">Sign in</Link>
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default SignupPage;
