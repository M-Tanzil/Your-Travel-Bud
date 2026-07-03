import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page-wrapper d-flex align-items-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 440 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'var(--primary)', fontSize: '2rem' }}>✈️ Travel Buddy</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to plan your perfect trip</p>
        </div>
        <Card className="tb-card p-4">
          <h4 className="mb-4 fw-bold">Welcome back</h4>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between">
                <Form.Label>Password</Form.Label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
              </div>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 btn-primary py-2 mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
          <hr />
          <p className="text-center mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="fw-semibold">Sign up free</Link>
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
