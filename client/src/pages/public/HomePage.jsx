import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { cityAPI } from '../../api';
import Spinner from '../../components/common/Spinner';

const HomePage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cityAPI.getAll({ limit: 6 })
      .then((res) => setCities(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?search=${search}`);
  };

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
                Your Perfect Trip Starts Here 🌍
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
                Plan day-by-day itineraries, book hotels & transport, and discover hidden gems — all in one place.
              </p>
              <Form onSubmit={handleSearch} className="d-flex gap-2 justify-content-center flex-wrap">
                <Form.Control
                  type="text"
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: 360, borderRadius: 8 }}
                />
                <Button type="submit" variant="warning" className="fw-semibold px-4">
                  🔍 Search
                </Button>
              </Form>
              <div className="d-flex gap-3 justify-content-center mt-4 flex-wrap">
                <Link to="/plan-trip" className="btn btn-light fw-semibold px-4">
                  🗺️ Plan a Trip
                </Link>
                <Link to="/explore" className="btn btn-outline-light fw-semibold px-4">
                  Explore Destinations
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────── */}
      <section className="py-5" style={{ background: 'var(--bg-secondary)' }}>
        <Container>
          <h2 className="section-title text-center">Everything You Need to Travel</h2>
          <p className="section-subtitle text-center">One platform for your complete travel experience</p>
          <Row className="g-4">
            {[
  {
    icon: "🏨",
    title: "Hotel Booking",
    desc: "Search and book hotels with real-time availability.",
    link: "/explore",
  },
  {
    icon: "🚂",
    title: "Train & Bus Booking",
    desc: "Book train and bus tickets.",
    link: "/my-bookings",
  },
  {
    icon: "💎",
    title: "Hidden Gems",
    desc: "Discover lesser-known spots.",
    link: "/hidden-gems",
  },
  {
    icon: "☀️",
    title: "Weather Forecast",
    desc: "Check weather before travelling.",
    link: "/explore",
  },
  {
  icon: '🗺️',
  title: 'AI Trip Planner',
  desc: 'Generate a complete day-by-day itinerary with AI or build your own custom plan.',
  link: '/plan-trip',
},
  {
    icon: "💰",
    title: "Budget Estimator",
    desc: "Estimate your trip budget.",
    link: "/budget",
  },
].map((f) => (
  <Col key={f.title} sm={6} md={4}>
    <Link
      to={f.link}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        className="tb-card p-4 h-100"
        style={{
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        <div
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
          }}
        >
          {f.icon}
        </div>

        <h5 className="fw-bold mb-2">
          {f.title}
        </h5>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            margin: 0,
          }}
        >
          {f.desc}
        </p>
      </div>
    </Link>
  </Col>
))}
          </Row>
        </Container>
      </section>

      {/* ─── POPULAR CITIES ───────────────────────────────── */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title mb-1">Popular Destinations</h2>
              <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>Top cities loved by travellers</p>
            </div>
            <Link to="/explore" className="btn btn-outline-primary btn-sm">View All</Link>
          </div>
          {loading ? <Spinner /> : (
            <Row className="g-4">
              {cities.map((city) => (
                <Col key={city._id} sm={6} md={4}>
                  <Link to={`/city/${city._id}`} style={{ textDecoration: 'none' }}>
                    <div className="tb-card">
                      <div style={{
                        height: 180,
                        background: `linear-gradient(135deg, #667eea, #764ba2)`,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '1rem',
                        position: 'relative',
                      }}>
                        {city.photos?.[0]?.url && (
                          <img src={city.photos[0].url} alt={city.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 20 }}>
                          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{city.country}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="fw-bold mb-1">{city.name}</h5>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {city.description}
                        </p>
                        {city.bestSeason && (
                          <Badge bg="primary" className="mt-2" style={{ fontSize: '0.7rem' }}>
                            Best: {city.bestSeason}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)' }}>
        <Container className="text-center text-white">
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem' }}>Ready to Plan Your Next Adventure?</h2>
          <p style={{ opacity: 0.85, fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join thousands of travellers planning smarter with Travel Buddy.
          </p>
          <Link to="/signup" className="btn btn-warning btn-lg fw-semibold px-5">
            Get Started Free 🚀
          </Link>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
