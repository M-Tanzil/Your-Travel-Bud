import { useState, useEffect, useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { supportAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const SupportPage = () => {
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const load = async () => {
    try {
      const res = await supportAPI.getMyConversation();
      setConversation(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await supportAPI.sendMessage({ content: message, subject: subject || 'General Inquiry' });
      setConversation(res.data.data);
      setMessage('');
      setSubject('');
    } catch {}
    setSending(false);
  };

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  const messages = conversation?.messages || [];

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-2">💬 Support Chat</h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Our team typically responds within 24 hours.
        </p>

        <Card className="tb-card" style={{ maxWidth: 700 }}>
          <Card.Body>
            {/* Chat Messages */}
            <div className="chat-container mb-3">
              {messages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '2rem' }}>💬</div>
                  <p className="mt-2">No messages yet. Send us a message and we'll get back to you!</p>
                </div>
              ) : messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender}`}>
                  <div>{msg.content}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: 4 }}>
                    {new Date(msg.sentAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <Form onSubmit={handleSend}>
              {messages.length === 0 && (
                <Form.Group className="mb-2">
                  <Form.Control
                    placeholder="Subject (e.g. Booking issue)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Form.Group>
              )}
              <div className="d-flex gap-2">
                <Form.Control
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <Button type="submit" className="btn-primary" disabled={sending}>
                  {sending ? '...' : 'Send'}
                </Button>
              </div>
            </Form>

            {conversation?.status === 'closed' && (
              <div className="mt-3 text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                This conversation has been closed.
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
