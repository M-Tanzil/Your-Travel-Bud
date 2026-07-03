import { useState, useEffect } from 'react';
import { Table, Form, Badge, Button } from 'react-bootstrap';
import { adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ search, page, limit: 20 });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, page]);

  const handleToggle = async (id) => {
    await adminAPI.toggleUser(id);
    load();
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">👥 User Management</h4>

        <Form.Control
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="mb-4"
          style={{ maxWidth: 360 }}
        />

        {loading ? <Spinner /> : (
          <>
            <div className="tb-card">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Trips</th>
                    <th>Bookings</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.875rem' }}>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No users found</td></tr>
                  ) : users.map((u) => (
                    <tr key={u._id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>{u.totalTrips || 0}</td>
                      <td>{u.totalBookings || 0}</td>
                      <td>
                        <Badge bg={u.isActive ? 'success' : 'danger'}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant={u.isActive ? 'outline-danger' : 'outline-success'}
                          onClick={() => handleToggle(u._id)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {pagination.pages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="btn btn-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {pagination.pages}</span>
                <button className="btn btn-outline-primary btn-sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
