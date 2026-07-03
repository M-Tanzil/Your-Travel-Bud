import { useState, useEffect } from 'react';
import { Row, Col, Badge, Tab, Nav } from 'react-bootstrap';
import { bookingAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const STATUS_COLOR = { confirmed: 'success', cancelled: 'danger', completed: 'secondary', waitlisted: 'warning' };

const BookingCard = ({ booking, type, onCancel }) => (
  <div className="tb-card p-3 mb-3">
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
      <div>
        <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
          {type === 'hotel' ? `🏨 ${booking.hotelId?.name || 'Hotel Booking'}` :
           type === 'train' ? `🚂 ${booking.from} → ${booking.to}` :
           `🚌 ${booking.from} → ${booking.to}`}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>
          Ref: {booking.bookingReference}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          {type === 'hotel' ? `Check-in: ${new Date(booking.checkIn).toLocaleDateString()} · Check-out: ${new Date(booking.checkOut).toLocaleDateString()}` :
           `Date: ${new Date(booking.journeyDate).toLocaleDateString()}`}
        </div>
        <div className="fw-semibold mt-1" style={{ color: 'var(--primary)' }}>
          ₹{booking.totalPrice?.toLocaleString()}
        </div>
      </div>
      <div className="d-flex flex-column align-items-end gap-2">
        <Badge bg={STATUS_COLOR[booking.status]}>{booking.status}</Badge>
        {booking.refundStatus !== 'not_requested' && (
          <Badge bg="warning" text="dark">Refund: {booking.refundStatus}</Badge>
        )}
        {booking.status === 'confirmed' && (
          <button onClick={() => onCancel(booking._id, type)} className="btn btn-outline-danger btn-sm">
            Cancel
          </button>
        )}
      </div>
    </div>
  </div>
);

const MyBookingsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [trains, setTrains] = useState([]);
  const [buses, setBuses] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [h, t, b, r] = await Promise.all([
        bookingAPI.getHotelBookings(),
        bookingAPI.getTrainBookings(),
        bookingAPI.getBusBookings(),
        bookingAPI.getRefunds(),
      ]);
      setHotels(h.data.data);
      setTrains(t.data.data);
      setBuses(b.data.data);
      setRefunds(r.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id, type) => {
    const reason = window.prompt('Reason for cancellation (optional):');
    try {
      if (type === 'hotel') await bookingAPI.cancelHotel(id, { reason });
      else if (type === 'train') await bookingAPI.cancelTrain(id, { reason });
      else await bookingAPI.cancelBus(id, { reason });
      alert('Booking cancelled. Refund request submitted.');
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">🎫 My Bookings</h4>

        <Tab.Container defaultActiveKey="hotels">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item><Nav.Link eventKey="hotels">🏨 Hotels ({hotels.length})</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="trains">🚂 Trains ({trains.length})</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="buses">🚌 Buses ({buses.length})</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="refunds">💰 Refunds ({refunds.length})</Nav.Link></Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="hotels">
              {hotels.length === 0 ? <EmptyState type="hotel" /> :
                hotels.map((b) => <BookingCard key={b._id} booking={b} type="hotel" onCancel={handleCancel} />)}
            </Tab.Pane>
            <Tab.Pane eventKey="trains">
              {trains.length === 0 ? <EmptyState type="train" /> :
                trains.map((b) => <BookingCard key={b._id} booking={b} type="train" onCancel={handleCancel} />)}
            </Tab.Pane>
            <Tab.Pane eventKey="buses">
              {buses.length === 0 ? <EmptyState type="bus" /> :
                buses.map((b) => <BookingCard key={b._id} booking={b} type="bus" onCancel={handleCancel} />)}
            </Tab.Pane>
            <Tab.Pane eventKey="refunds">
              {refunds.length === 0 ? (
                <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>No refund requests</div>
              ) : refunds.map((r) => (
                <div key={r._id} className="tb-card p-3 mb-3">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <div>
                      <div className="fw-semibold">{r.bookingType?.toUpperCase()} Booking Refund</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ref: {r.bookingReference}</div>
                      <div style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{r.amount?.toLocaleString()}</div>
                      {r.reason && <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Reason: {r.reason}</div>}
                      {r.adminNote && <div style={{ color: '#059669', fontSize: '0.8rem' }}>Admin Note: {r.adminNote}</div>}
                    </div>
                    <Badge bg={r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'danger' : r.status === 'processed' ? 'info' : 'warning'}>
                      {r.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

const EmptyState = ({ type }) => {
  const icons = { hotel: '🏨', train: '🚂', bus: '🚌' };
  const links = { hotel: '/hotels', train: '/trains', bus: '/buses' };
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: '3rem' }}>{icons[type]}</div>
      <p style={{ color: 'var(--text-secondary)' }} className="mt-2">No {type} bookings yet</p>
    </div>
  );
};

export default MyBookingsPage;
