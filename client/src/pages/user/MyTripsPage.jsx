import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Badge, Button } from 'react-bootstrap';
import { itineraryAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const STATUS_COLORS = { upcoming: 'primary', ongoing: 'success', completed: 'secondary' };

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await itineraryAPI.getAll({ status: filter || undefined, page, limit: 9 });
      setTrips(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    await itineraryAPI.delete(id);
    load();
  };

  const handleDuplicate = async (id) => {
    await itineraryAPI.duplicate(id, {});
    load();
  };

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-bold mb-0">✈️ My Trips</h4>
          <Link to="/plan-trip" className="btn btn-primary btn-sm">+ Plan New Trip</Link>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {['', 'upcoming', 'ongoing', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : trips.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>🌍</div>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-2">No trips found</p>
            <Link to="/plan-trip" className="btn btn-primary btn-sm mt-2">Plan Your First Trip</Link>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {trips.map((trip) => (
                <Col key={trip._id} sm={6} md={4}>
                  <div className="tb-card h-100">
                    <div style={{ height: 120, background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0.75rem' }}>
                      <Badge bg={STATUS_COLORS[trip.status]}>{trip.status}</Badge>
                      {trip.isAIGenerated && <Badge bg="warning" text="dark" className="ms-2">🤖 AI</Badge>}
                    </div>
                    <div className="p-3">
                      <h6 className="fw-bold mb-1">{trip.title}</h6>
                      <p className="mb-1" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        📍 {trip.cityId?.name}, {trip.cityId?.country}
                      </p>
                      <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      <p className="mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        👥 {trip.travelers?.adults} adults{trip.travelers?.children > 0 ? `, ${trip.travelers.children} kids` : ''}
                        &nbsp;·&nbsp; {trip.days?.length} days
                      </p>
                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={`/my-trips/${trip._id}`} className="btn btn-primary btn-sm">View Plan</Link>
                        <button onClick={() => handleDuplicate(trip._id)} className="btn btn-outline-primary btn-sm">Duplicate</button>
                        <button onClick={() => handleDelete(trip._id)} className="btn btn-outline-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

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

export default MyTripsPage;
