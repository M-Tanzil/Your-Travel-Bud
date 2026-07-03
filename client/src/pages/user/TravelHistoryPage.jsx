import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { userAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const TravelHistoryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getHistory().then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  const { trips = [], stats = {} } = data || {};

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">📊 Travel History & Stats</h4>

        {/* Stats Grid */}
        <Row className="g-3 mb-4">
          {[
            { icon: '✈️', label: 'Total Trips', value: stats.totalTrips || 0, color: '#2563eb' },
            { icon: '✅', label: 'Completed', value: stats.completedTrips || 0, color: '#10b981' },
            { icon: '🏙️', label: 'Cities Visited', value: stats.citiesVisited || 0, color: '#8b5cf6' },
            { icon: '🎫', label: 'Total Bookings', value: stats.totalBookings || 0, color: '#f59e0b' },
            { icon: '🏨', label: 'Hotel Bookings', value: stats.hotelBookings || 0, color: '#ef4444' },
            { icon: '🚂', label: 'Train Bookings', value: stats.trainBookings || 0, color: '#6366f1' },
          ].map((s) => (
            <Col key={s.label} xs={6} sm={4} md={2}>
              <div className="stat-card text-center">
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{s.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Trip History */}
        <h6 className="fw-bold mb-3">All Trips</h6>
        {trips.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>🌍</div>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-2">No trips yet</p>
            <Link to="/plan-trip" className="btn btn-primary btn-sm mt-2">Plan Your First Trip</Link>
          </div>
        ) : (
          <Row className="g-3">
            {trips.map((trip) => (
              <Col key={trip._id} sm={6} md={4}>
                <Link to={`/my-trips/${trip._id}`} style={{ textDecoration: 'none' }}>
                  <div className="tb-card p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.95rem' }}>{trip.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          📍 {trip.cityId?.name}, {trip.cityId?.country}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge bg={{ upcoming: 'primary', ongoing: 'success', completed: 'secondary' }[trip.status]}>
                        {trip.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default TravelHistoryPage;
