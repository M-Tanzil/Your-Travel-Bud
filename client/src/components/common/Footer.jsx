import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer className="tb-footer">
    <Container>
      <Row className="mb-4">
        <Col md={4} className="mb-4 mb-md-0">
          <h5 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800 }}>✈️ Travel Buddy</h5>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
            Your all-in-one travel planning companion. Plan trips, book hotels, trains & buses, and discover hidden gems.
          </p>
        </Col>
        <Col md={2} className="mb-4 mb-md-0">
          <h6>Explore</h6>
          <div className="d-flex flex-column gap-2">
            <Link to="/explore">Destinations</Link>
            <Link to="/hidden-gems">Hidden Gems</Link>
            <Link to="/leaderboard">Top Rated</Link>
            <Link to="/blogs">Community</Link>
          </div>
        </Col>
        <Col md={2} className="mb-4 mb-md-0">
          <h6>Plan</h6>
          <div className="d-flex flex-column gap-2">
            <Link to="/plan-trip">Plan a Trip</Link>
            <Link to="/my-trips">My Trips</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </Col>
        <Col md={2} className="mb-4 mb-md-0">
          <h6>Support</h6>
          <div className="d-flex flex-column gap-2">
            <Link to="/faq">FAQ</Link>
            <Link to="/support">Contact Support</Link>
          </div>
        </Col>
        <Col md={2}>
          <h6>Company</h6>
          <div className="d-flex flex-column gap-2">
            <Link to="/about">About Us</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </Col>
      </Row>
      <hr style={{ borderColor: '#334155' }} />
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ fontSize: '0.85rem' }}>
        <span>© {new Date().getFullYear()} Travel Buddy. All rights reserved.</span>
        <span>Made with ❤️ for travellers</span>
      </div>
    </Container>
  </footer>
);

export default Footer;
