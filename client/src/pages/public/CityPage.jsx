import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Tab, Nav, Badge, Card } from 'react-bootstrap';
import { cityAPI, hiddenGemAPI, weatherAPI } from '../../api';
import Spinner from '../../components/common/Spinner';

const CityPage = () => {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [gems, setGems] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const cityRes = await cityAPI.getOne(id);
        const c = cityRes.data.data;
        setCity(c);

        const [gemRes, weatherRes] = await Promise.allSettled([
          hiddenGemAPI.getByCity(id),
          weatherAPI.get({ city: c.name }),
        ]);
        if (gemRes.status === 'fulfilled') setGems(gemRes.value.data.data.gems || []);
        if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value.data.data.current);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Spinner fullPage />;
  if (!city) return <div className="text-center py-5">City not found.</div>;

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div style={{ height: 320, background: 'linear-gradient(135deg, #1e40af, #2563eb)', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
        {city.photos?.[photoIdx]?.url && (
          <img src={city.photos[photoIdx].url} alt={city.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        <Container style={{ position: 'relative', zIndex: 1, paddingBottom: '1.5rem' }}>
          <h1 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 800, fontSize: '2.5rem', marginBottom: '0.25rem' }}>{city.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.75rem' }}>{city.country}</p>
          <div className="d-flex gap-2 flex-wrap">
            {city.bestSeason && <Badge bg="warning" text="dark">🌤️ Best Season: {city.bestSeason}</Badge>}
            {city.language && <Badge bg="light" text="dark">🗣️ {city.language}</Badge>}
            {city.population && <Badge bg="light" text="dark">👥 {city.population}</Badge>}
          </div>
        </Container>
        {/* Photo gallery dots */}
        {city.photos?.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 6 }}>
            {city.photos.map((_, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', background: i === photoIdx ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
        )}
      </div>

      <Container className="py-4">
        <div className="d-flex gap-3 mb-4 flex-wrap">
          <Link to={`/plan-trip?cityId=${city._id}&city=${city.name}`} className="btn btn-primary">🗺️ Plan a Trip Here</Link>
          <Link to={`/hotels?cityId=${city._id}`} className="btn btn-outline-primary">🏨 Find Hotels</Link>
          <Link to={`/hidden-gems?cityId=${city._id}`} className="btn btn-outline-primary">💎 Hidden Gems</Link>
        </div>

        <Row>
          <Col md={8}>
            <Tab.Container defaultActiveKey="overview">
              <Nav variant="tabs" className="mb-4">
                <Nav.Item><Nav.Link eventKey="overview">Overview</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="food">Must-Try Foods</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="transport">Getting Around</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="gems">Hidden Gems</Nav.Link></Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{city.description}</p>
                  <Row className="g-3 mt-2">
                    {[
                      { label: 'Climate', value: city.climate, icon: '🌡️' },
                      { label: 'Culture', value: city.culture, icon: '🏛️' },
                      { label: 'Best Season', value: city.bestSeasonDetails || city.bestSeason, icon: '📅' },
                    ].map((item) => item.value && (
                      <Col key={item.label} sm={6}>
                        <div className="tb-card p-3">
                          <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                          <div className="fw-semibold mt-1">{item.label}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.value}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="food">
                  <Row className="g-3">
                    {city.mustTryFoods?.length === 0 && <Col><p style={{ color: 'var(--text-secondary)' }}>No food listings yet.</p></Col>}
                    {city.mustTryFoods?.map((food, i) => (
                      <Col key={i} sm={6}>
                        <div className="tb-card p-3">
                          <div style={{ fontSize: '2rem' }}>🍜</div>
                          <h6 className="fw-bold mt-2">{food.name}</h6>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{food.description}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="transport">
                  <Row className="g-3">
                    {city.publicTransport && Object.entries(city.publicTransport).map(([key, val]) =>
                      val?.description ? (
                        <Col key={key} sm={6}>
                          <div className="tb-card p-3">
                            <div style={{ fontSize: '1.5rem' }}>
                              {key === 'metro' ? '🚇' : key === 'bus' ? '🚌' : key === 'taxi' ? '🚕' : key === 'rickshaw' ? '🛺' : '🚗'}
                            </div>
                            <div className="fw-semibold mt-1 text-capitalize">{key}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{val.description}</div>
                            {val.available === false && <Badge bg="danger" className="mt-1">Not available</Badge>}
                          </div>
                        </Col>
                      ) : null
                    )}
                    {city.publicTransport?.other && (
                      <Col sm={12}>
                        <div className="tb-card p-3">
                          <div className="fw-semibold">Other</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{city.publicTransport.other}</div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="gems">
                  {gems.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No hidden gems listed yet.</p> : (
                    <Row className="g-3">
                      {gems.map((gem) => (
                        <Col key={gem._id} sm={6}>
                          <div className="tb-card p-3">
                            {gem.hasExpertBadge && <span className="badge-expert mb-2 d-inline-block">⭐ Expert Pick</span>}
                            <h6 className="fw-bold">{gem.name}</h6>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{gem.description?.substring(0, 100)}...</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          <Col md={4}>
            {/* Weather Card */}
            {weather && (
              <Card className="tb-card mb-3">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Current Weather</h6>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ fontSize: '3rem' }}>
                      {weather.weather?.[0]?.main === 'Clear' ? '☀️' : weather.weather?.[0]?.main === 'Rain' ? '🌧️' : weather.weather?.[0]?.main === 'Clouds' ? '☁️' : '🌤️'}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{Math.round(weather.main?.temp)}°C</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {weather.weather?.[0]?.description}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-3 mt-2" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>💧 {weather.main?.humidity}%</span>
                    <span>💨 {weather.wind?.speed} m/s</span>
                    <span>🌡️ Feels {Math.round(weather.main?.feels_like)}°C</span>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Photo Gallery */}
            {city.photos?.length > 0 && (
              <Card className="tb-card mb-3">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Photo Gallery</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {city.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo.url}
                        alt={photo.caption || city.name}
                        onClick={() => setPhotoIdx(i)}
                        style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: i === photoIdx ? '2px solid var(--primary)' : '2px solid transparent' }}
                      />
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Upcoming Events */}
            {city.upcomingEvents?.length > 0 && (
              <Card className="tb-card">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Upcoming Events</h6>
                  {city.upcomingEvents.map((event) => (
                    <div key={event._id} className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{event.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        📅 {new Date(event.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CityPage;
