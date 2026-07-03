import { useState, useEffect, useRef } from 'react';
import { Row, Col, Badge, Form, Button } from 'react-bootstrap';
import { supportAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const AdminSupport = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const load = async () => {
    try {
      const res = await supportAPI.getAllConversations({ limit: 50 });
      setConversations(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected]);

  const handleSelect = (conv) => setSelected(conv);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      const res = await supportAPI.adminReply(selected._id, { content: reply });
      setSelected(res.data.data);
      setReply('');
      load();
    } catch {}
    setSending(false);
  };

  const handleClose = async () => {
    try {
      const res = await supportAPI.closeConversation(selected._id);
      setSelected(res.data.data);
      load();
    } catch {}
  };

  if (loading) return <div className="dashboard-layout"><AdminSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">💬 Support Conversations</h4>
        <Row className="g-0" style={{ height: 'calc(100vh - 160px)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Conversation List */}
          <Col md={4} style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--bg-card)' }}>
            {conversations.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>No conversations yet</div>
            ) : conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleSelect(conv)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selected?._id === conv._id ? 'var(--primary-light)' : 'transparent',
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{conv.userId?.name}</div>
                  <Badge bg={conv.status === 'open' ? 'success' : 'secondary'} style={{ fontSize: '0.7rem' }}>{conv.status}</Badge>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{conv.userId?.email}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 4 }}>
                  {conv.subject || 'General Inquiry'} · {conv.messages?.length} messages
                </div>
              </div>
            ))}
          </Col>

          {/* Chat Panel */}
          <Col md={8} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
            {!selected ? (
              <div className="d-flex align-items-center justify-content-center h-100" style={{ color: 'var(--text-secondary)' }}>
                Select a conversation to view
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{selected.userId?.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{selected.userId?.email}</div>
                    </div>
                    {selected.status === 'open' && (
                      <Button size="sm" variant="outline-secondary" onClick={handleClose}>Close Chat</Button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-container flex-1" style={{ borderRadius: 0, height: 'auto', flex: 1, overflowY: 'auto' }}>
                  {selected.messages?.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.sender}`}>
                      <div>{msg.content}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: 4 }}>
                        {msg.sender === 'admin' ? '👤 Admin' : '🧑 User'} · {new Date(msg.sentAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply Input */}
                {selected.status === 'open' && (
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                    <Form onSubmit={handleReply}>
                      <div className="d-flex gap-2">
                        <Form.Control
                          placeholder="Type a reply..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          required
                        />
                        <Button type="submit" className="btn-primary" disabled={sending}>
                          {sending ? '...' : 'Send'}
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminSupport;
