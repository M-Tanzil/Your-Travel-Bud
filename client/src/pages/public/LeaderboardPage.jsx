import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Tab, Nav, Form } from 'react-bootstrap';
import { leaderboardAPI, cityAPI } from '../../api';
import AppNavbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Spinner from '../../components/common/Spinner';

const LeaderboardPage = () => {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, hRes] = await Promise.all([
        leaderboardAPI.getPlaces({ cityId: cityFilter || undefined, limit: 10 }),
        leaderboardAPI.getHotels({ cityId: cityFilter || undefined, limit: 10 }),
      ]);
      setPlaces(pRes.data.data);
      setHotels(hRes.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    cityAPI.getAll({ limit: 50 }).then((r) => setCities(r.data.data));
  }, []);

  useEffect(() => { load(); }, [cityFilter]);

  const RankCard = ({ item, rank, type }) => (
    <Link to={`/${type}/${item._id}`} style={{ textDecoration: 'none' }}>
      <div className="tb-card p-3 mb-3 d-flex align-items-center gap-3">
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#b45309' : 'var(--bg-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: rank <= 3 ? '1.1rem' : '0.9rem',
          color: rank <= 3 ? 'white' : 'var(--text-secondary)',
        }}>
          {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
        </div>
        <div className="flex-1">
          <div className="fw-semibold">{item.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {item.cityId?.name}, {item.cityId?.country}
            {item.category && ` · ${item.category}`}
          </div>
        </div>
        <div className="text-end">
          <div className="stars fw-bold">⭐ {item.rating?.toFixed(1) || '—'}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{item.reviewCount} reviews</div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <AppNavbar />
      <div className="page-wrapper py-4" style={{ background: 'var(--bg-secondary)' }}>
        <Container>
          <div className="text-center mb-4">
            <h2 className="section-title">🏆 Top Rated</h2>
            <p className="section-subtitle">The best places and hotels, ranked by traveller reviews</p>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <Form.Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={{ maxWidth: 280 }}>
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Form.Select>
          </div>

          {loading ? <Spinner /> : (
            <Tab.Container defaultActiveKey="places">
              <Nav variant="tabs" className="mb-4 justify-content-center">
                <Nav.Item><Nav.Link eventKey="places">📍 Top Places</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="hotels">🏨 Top Hotels</Nav.Link></Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="places">
                  <Row className="justify-content-center">
                    <Col md={8}>
                      {places.length === 0 ? <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No places rated yet.</p> :
                        places.map((p, i) => <RankCard key={p._id} item={p} rank={i + 1} type="place" />)}
                    </Col>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="hotels">
                  <Row className="justify-content-center">
                    <Col md={8}>
                      {hotels.length === 0 ? <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No hotels rated yet.</p> :
                        hotels.map((h, i) => <RankCard key={h._id} item={h} rank={i + 1} type="hotel" />)}
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
