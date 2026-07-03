import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { itineraryAPI, bookingAPI, userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tripsRes, bookingsRes, historyRes] = await Promise.all([
          itineraryAPI.getAll({ status: 'upcoming', limit: 3 }),
          bookingAPI.getAll({ limit: 3 }),
          userAPI.getHistory(),
        ]);
        setUpcomingTrips(tripsRes.data.data);
        setRecentBookings(bookingsRes.data.data);
        setStats(historyRes.data.data.stats);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const statusColor = { upcoming: 'primary', ongoing: 'success', completed: 'secondary' };
  const bookingTypeIcon = { hotel: '🏨', train: '🚂', bus: '🚌' };

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className="countdown-box mb-4">
          <h4 className="mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h4>
          <p className="mb-3" style={{ opacity: 0.85 }}>Where would you like to go next?</p>
          <Link to="/plan-trip" className="btn btn-warning fw-semibold">🗺️ Plan a New Trip</Link>
        </div>

        {/* Quick Links */}
        <Row className="g-3 mb-4">
          {[
            { to: '/my-trips', icon: '✈️', label: 'My Trips', count: stats?.totalTrips },
            { to: '/my-bookings', icon: '🏨', label: 'Bookings', count: stats?.totalBookings },
            { to: '/wishlist', icon: '❤️', label: 'Wishlist' },
            { to: '/history', icon: '📊', label: 'Travel Stats' },
          ].map((item) => (
            <Col key={item.to} xs={6} md={3}>
              <Link to={item.to} style={{ textDecoration: 'none' }}>
                <div className="stat-card text-center">
                  <div style={{ fontSize: '1.75rem' }}>{item.icon}</div>
                  <div className="fw-semibold mt-1" style={{ fontSize: '0.9rem' }}>{item.label}</div>
                  {item.count !== undefined && (
                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>{item.count}</div>
                  )}
                </div>
              </Link>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Upcoming Trips */}
          <Col md={6}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">✈️ Upcoming Trips</h6>
              <Link to="/my-trips" style={{ fontSize: '0.85rem' }}>View all</Link>
            </div>
            {upcomingTrips.length === 0 ? (
              <div className="tb-card p-4 text-center">
                <div style={{ fontSize: '2.5rem' }}>🌍</div>
                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>No upcoming trips yet</p>
                <Link to="/plan-trip" className="btn btn-primary btn-sm">Plan Your First Trip</Link>
              </div>
            ) : upcomingTrips.map((trip) => (
              <div key={trip._id} className="tb-card p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="fw-bold mb-1">{trip.title}</h6>
                    <p className="mb-1" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      📍 {trip.cityId?.name}, {trip.cityId?.country}
                    </p>
                    <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge bg={statusColor[trip.status]}>{trip.status}</Badge>
                </div>
                <div className="mt-2">
                  <TripCountdown startDate={trip.startDate} />
                </div>
                <Link to={`/my-trips/${trip._id}`} className="btn btn-outline-primary btn-sm mt-2">View Plan</Link>
              </div>
            ))}
          </Col>

          {/* Recent Bookings */}
          <Col md={6}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">🏨 Recent Bookings</h6>
              <Link to="/my-bookings" style={{ fontSize: '0.85rem' }}>View all</Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="tb-card p-4 text-center">
                <div style={{ fontSize: '2.5rem' }}>🎫</div>
                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>No bookings yet</p>
                <Link to="/explore" className="btn btn-primary btn-sm">Explore Hotels</Link>
              </div>
            ) : recentBookings.map((booking) => (
              <div key={booking._id} className="tb-card p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                      {bookingTypeIcon[booking.bookingType]} {booking.hotelId?.name || booking.from + ' → ' + booking.to}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {booking.bookingReference}
                    </div>
                  </div>
                  <Badge bg={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};

const TripCountdown = ({ startDate }) => {
  const days = Math.ceil((new Date(startDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days === 0) return <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>🎉 Trip starts today!</span>;
  return <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>⏳ {days} days to go</span>;
};

export default DashboardPage;
