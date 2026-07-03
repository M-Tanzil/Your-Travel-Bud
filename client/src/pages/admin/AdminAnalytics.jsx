import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminAPI.getStats({ period }).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, [period]);

  const BarChart = ({ data, label }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
      <div>
        <div className="d-flex align-items-end gap-2" style={{ height: 120 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.value}</div>
              <div style={{ width: '100%', height: `${(d.value / max) * 100}px`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = ({ segments }) => {
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let cumulative = 0;
    const colors = ['#2563eb', '#10b981', '#f59e0b'];

    return (
      <div className="d-flex align-items-center gap-4">
        <svg width={100} height={100} viewBox="0 0 36 36">
          {segments.map((seg, i) => {
            const pct = (seg.value / total) * 100;
            const offset = cumulative;
            cumulative += pct;
            const circumference = 100;
            return (
              <circle key={i} cx="18" cy="18" r="15.9"
                fill="transparent"
                stroke={colors[i]}
                strokeWidth="3"
                strokeDasharray={`${pct} ${circumference - pct}`}
                strokeDashoffset={25 - offset}
                style={{ transition: 'all 0.3s' }}
              />
            );
          })}
        </svg>
        <div>
          {segments.map((seg, i) => (
            <div key={i} className="d-flex align-items-center gap-2 mb-1">
              <div style={{ width: 12, height: 12, borderRadius: 3, background: colors[i] }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{seg.label}: <strong>{seg.value}</strong></span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="dashboard-layout"><AdminSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  const bookingData = [
    { label: 'Hotels', value: stats?.bookingBreakdown?.hotel || 0 },
    { label: 'Trains', value: stats?.bookingBreakdown?.train || 0 },
    { label: 'Buses', value: stats?.bookingBreakdown?.bus || 0 },
  ];

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-bold mb-0">📈 Analytics</h4>
          <div className="d-flex gap-2">
            {['weekly', 'monthly'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-outline-primary'}`}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <Row className="g-3 mb-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: '#2563eb' },
            { label: `New Users (${period})`, value: stats?.newUsers, icon: '✨', color: '#10b981' },
            { label: 'Total Bookings', value: stats?.totalBookings, icon: '🎫', color: '#8b5cf6' },
            { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#f59e0b' },
          ].map((m) => (
            <Col key={m.label} xs={6} md={3}>
              <div className="stat-card">
                <div style={{ fontSize: '1.5rem' }}>{m.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: m.color, marginTop: 4 }}>{m.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{m.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Booking Distribution */}
          <Col md={6}>
            <div className="tb-card p-4">
              <h6 className="fw-bold mb-4">🎫 Booking Distribution</h6>
              <DonutChart segments={bookingData} />
            </div>
          </Col>

          {/* Booking Bar Chart */}
          <Col md={6}>
            <div className="tb-card p-4">
              <h6 className="fw-bold mb-4">📊 Bookings by Type</h6>
              <BarChart data={bookingData} />
            </div>
          </Col>

          {/* Revenue Breakdown */}
          <Col md={6}>
            <div className="tb-card p-4">
              <h6 className="fw-bold mb-4">💰 Revenue Summary</h6>
              <div className="d-flex flex-column gap-3">
                {bookingData.map((item, i) => {
                  const colors = ['#2563eb', '#10b981', '#f59e0b'];
                  const totalBookings = bookingData.reduce((s, d) => s + d.value, 0) || 1;
                  const pct = Math.round((item.value / totalBookings) * 100);
                  return (
                    <div key={i}>
                      <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                        <span>{item.label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: colors[i], borderRadius: 4, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Quick Stats */}
          <Col md={6}>
            <div className="tb-card p-4">
              <h6 className="fw-bold mb-4">⚡ Platform Health</h6>
              <div className="d-flex flex-column gap-3">
                {[
                  { label: 'Active Users', value: stats?.totalUsers, icon: '✅', color: '#10b981' },
                  { label: 'Active Bookings', value: stats?.activeTrips, icon: '🟢', color: '#10b981' },
                  { label: 'Pending Refunds', value: stats?.pendingRefunds, icon: stats?.pendingRefunds > 0 ? '⚠️' : '✅', color: stats?.pendingRefunds > 0 ? '#f59e0b' : '#10b981' },
                ].map((item) => (
                  <div key={item.label} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.icon} {item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminAnalytics;
