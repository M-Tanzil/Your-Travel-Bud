import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../utils/axiosInstance';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', message: 'Password reset link sent to your email.' });
    } catch (err) {
      setStatus({ type: 'danger', message: err.response?.data?.message || 'Failed to send reset email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper d-flex align-items-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'var(--primary)', fontSize: '2rem' }}>✈️ Travel Buddy</h1>
        </div>
        <Card className="tb-card p-4">
          <h4 className="mb-1 fw-bold">Forgot Password?</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="mb-4">
            Enter your email and we'll send you a reset link.
          </p>
          {status && <Alert variant={status.type} className="py-2">{status.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100 btn-primary py-2" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form>
          <p className="text-center mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
            <Link to="/login">← Back to Login</Link>
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
