import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to || '#'} style={{ textDecoration: 'none' }}>
    <div className="stat-card h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value?.toLocaleString?.() ?? value}</div>
        </div>
        <div className="stat-icon" style={{ background: `${color}20` }}>
          <span style={{ fontSize: '1.25rem' }}>{icon}</span>
        </div>
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes] = await Promise.all([
        adminAPI.getStats({ period }),
        adminAPI.getActivity(),
      ]);
      setStats(statsRes.data.data);
      setActivity(activityRes.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [period]);

  const activityIcon = { new_user: '👤', new_booking: '🎫', new_blog: '✍️', new_refund: '💰' };
  const activityLabel = { new_user: 'New User', new_booking: 'New Booking', new_blog: 'New Blog', new_refund: 'Refund Request' };

  if (loading) return <div className="dashboard-layout"><AdminSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-bold mb-0">📊 Admin Dashboard</h4>
          <div className="d-flex gap-2">
            {['weekly', 'monthly'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-outline-primary'}`}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}><StatCard icon="👥" label="Total Users" value={stats?.totalUsers} color="#2563eb" to="/admin/users" /></Col>
          <Col xs={6} md={3}><StatCard icon="✨" label="New Users" value={stats?.newUsers} color="#10b981" /></Col>
          <Col xs={6} md={3}><StatCard icon="🎫" label="Total Bookings" value={stats?.totalBookings} color="#8b5cf6" to="/admin/bookings" /></Col>
          <Col xs={6} md={3}><StatCard icon="💰" label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="#f59e0b" /></Col>
          <Col xs={6} md={3}><StatCard icon="🏨" label="Hotel Bookings" value={stats?.bookingBreakdown?.hotel} color="#ef4444" /></Col>
          <Col xs={6} md={3}><StatCard icon="🚂" label="Train Bookings" value={stats?.bookingBreakdown?.train} color="#6366f1" /></Col>
          <Col xs={6} md={3}><StatCard icon="🚌" label="Bus Bookings" value={stats?.bookingBreakdown?.bus} color="#14b8a6" /></Col>
          <Col xs={6} md={3}>
            <Link to="/admin/refunds" style={{ textDecoration: 'none' }}>
              <div className="stat-card h-100" style={{ border: stats?.pendingRefunds > 0 ? '2px solid #f59e0b' : undefined }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>Pending Refunds</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{stats?.pendingRefunds || 0}</div>
                  </div>
                  <div className="stat-icon" style={{ background: '#fef3c7' }}>
                    <span>⚠️</span>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Activity Log */}
          <Col md={8}>
            <div className="tb-card p-4">
              <h6 className="fw-bold mb-3">📋 Recent Activity</h6>
              {activity.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No recent activity.</p>
              ) : activity.slice(0, 12).map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '1.25rem', width: 32, textAlign: 'center' }}>{activityIcon[item.type]}</div>
                  <div className="flex-1">
                    <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{activityLabel[item.type]}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {' — '}
                      {item.type === 'new_user' ? item.data?.name :
                       item.type === 'new_booking' ? (item.data?.hotelId?.name || item.data?.bookingReference) :
                       item.type === 'new_blog' ? item.data?.title :
                       item.data?.bookingReference}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', flexShrink: 0 }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Quick Actions */}
          <Col md={4}>
            <div className="tb-card p-4 mb-3">
              <h6 className="fw-bold mb-3">⚡ Quick Actions</h6>
              <div className="d-flex flex-column gap-2">
                {[
                  { to: '/admin/cities', label: '🏙️ Add New City' },
                  { to: '/admin/places', label: '📍 Add New Place' },
                  { to: '/admin/hotels', label: '🏨 Add New Hotel' },
                  { to: '/admin/announcements', label: '📢 Send Announcement' },
                  { to: '/admin/refunds', label: '💰 Process Refunds' },
                  { to: '/admin/support', label: '💬 View Support Chats' },
                ].map((action) => (
                  <Link key={action.to} to={action.to} className="btn btn-outline-primary btn-sm text-start">{action.label}</Link>
                ))}
              </div>
            </div>

            {stats?.pendingRefunds > 0 && (
              <div className="tb-card p-4" style={{ border: '2px solid #f59e0b' }}>
                <h6 className="fw-bold mb-2">⚠️ Action Required</h6>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  {stats.pendingRefunds} refund request{stats.pendingRefunds > 1 ? 's' : ''} awaiting review.
                </p>
                <Link to="/admin/refunds" className="btn btn-warning btn-sm fw-semibold">Review Refunds</Link>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
