import { useState, useEffect } from 'react';
import { Table, Badge, Button, Form } from 'react-bootstrap';
import { adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const AdminRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getRefunds({ status: filter || undefined, page, limit: 20 });
      setRefunds(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleProcess = async (id, status) => {
    const adminNote = status === 'rejected' ? window.prompt('Reason for rejection:') : '';
    try {
      await adminAPI.processRefund(id, { status, adminNote });
      load();
    } catch {}
  };

  const statusColor = { pending: 'warning', approved: 'success', rejected: 'danger', processed: 'info' };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">💰 Refund Requests</h4>

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {['', 'pending', 'approved', 'rejected', 'processed'].map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-primary'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : (
          <div className="tb-card">
            <Table responsive hover className="mb-0">
              <thead>
                <tr style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <th>User</th>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.875rem' }}>
                {refunds.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No refunds found</td></tr>
                ) : refunds.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="fw-semibold">{r.userId?.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{r.userId?.email}</div>
                    </td>
                    <td><Badge bg="secondary">{r.bookingType}</Badge></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.bookingReference}</td>
                    <td className="fw-semibold" style={{ color: 'var(--primary)' }}>₹{r.amount?.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: 150 }}>{r.reason || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><Badge bg={statusColor[r.status]}>{r.status}</Badge></td>
                    <td>
                      {r.status === 'pending' && (
                        <div className="d-flex gap-1">
                          <Button size="sm" variant="success" onClick={() => handleProcess(r._id, 'approved')}>✓</Button>
                          <Button size="sm" variant="danger" onClick={() => handleProcess(r._id, 'rejected')}>✗</Button>
                        </div>
                      )}
                      {r.status === 'approved' && (
                        <Button size="sm" variant="info" onClick={() => handleProcess(r._id, 'processed')}>Mark Processed</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="btn btn-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {pagination.pages}</span>
            <button className="btn btn-outline-primary btn-sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRefunds;
