import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Card, Badge } from 'react-bootstrap';
import { hiddenGemAPI, cityAPI } from '../../api';
import AppNavbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Spinner from '../../components/common/Spinner';

const HiddenGemsPage = () => {
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [gems, setGems] = useState([]);
  const [foodShops, setFoodShops] = useState([]);
  const [selectedCity, setSelectedCity] = useState(searchParams.get('cityId') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cityAPI.getAll({ limit: 50 }).then((r) => setCities(r.data.data));
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    hiddenGemAPI.getByCity(selectedCity)
      .then((r) => {
        setGems(r.data.data.gems || []);
        setFoodShops(r.data.data.foodShops || []);
      })
      .finally(() => setLoading(false));
  }, [selectedCity]);

  return (
    <div>
      <AppNavbar />
      <div className="page-wrapper py-4" style={{ background: 'var(--bg-secondary)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">💎 Hidden Gems</h2>
            <p className="section-subtitle">Discover the secret spots and famous foods locals love</p>
          </div>

          <div className="d-flex justify-content-center mb-5">
            <Form.Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ maxWidth: 320 }}
            >
              <option value="">Select a city to explore...</option>
              {cities.map((c) => <option key={c._id} value={c._id}>{c.name}, {c.country}</option>)}
            </Form.Select>
          </div>

          {!selectedCity && (
            <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '4rem' }}>💎</div>
              <p className="mt-3">Select a city to discover its hidden gems</p>
            </div>
          )}

          {loading && <Spinner />}

          {!loading && selectedCity && (
            <>
              {/* Hidden Gems */}
              <h5 className="fw-bold mb-3">✨ Hidden Places</h5>
              {gems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No hidden gems listed for this city yet.</p>
              ) : (
                <Row className="g-4 mb-5">
                  {gems.map((gem) => (
                    <Col key={gem._id} sm={6} md={4}>
                      <div className="tb-card h-100 p-4">
                        {gem.hasExpertBadge && (
                          <div className="mb-2">
                            <span className="badge-expert">⭐ {gem.expertName || 'Local Expert Pick'}</span>
                          </div>
                        )}
                        <h5 className="fw-bold">{gem.name}</h5>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{gem.description}</p>
                        {gem.story && (
                          <div className="mt-2 p-2" style={{ background: 'var(--primary-light)', borderRadius: 8, fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--primary)' }}>
                            "{gem.story}"
                          </div>
                        )}
                        <div className="mt-3 d-flex gap-3" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {gem.travelTime?.walking && <span>🚶 {gem.travelTime.walking}</span>}
                          {gem.travelTime?.driving && <span>🚗 {gem.travelTime.driving}</span>}
                          {gem.distanceFromCenter && <span>📍 {gem.distanceFromCenter} km from center</span>}
                        </div>

                        {/* Famous Foods */}
                        {gem.famousFoods?.length > 0 && (
                          <div className="mt-3">
                            <div className="fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>🍜 Famous Foods Here:</div>
                            {gem.famousFoods.map((food, i) => (
                              <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                                <span style={{ fontSize: '0.85rem' }}>{food.name}</span>
                                {food.rating > 0 && <span className="stars" style={{ fontSize: '0.8rem' }}>⭐ {food.rating}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              )}

              {/* Food Shops */}
              <h5 className="fw-bold mb-3">🍜 Famous Food Shops</h5>
              {foodShops.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No food shops listed for this city yet.</p>
              ) : (
                <Row className="g-4">
                  {foodShops.map((shop) => (
                    <Col key={shop._id} sm={6} md={4}>
                      <div className="tb-card h-100 p-4">
                        <h6 className="fw-bold">{shop.name}</h6>
                        {shop.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{shop.description}</p>}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {shop.openingHours?.open && <span>🕐 {shop.openingHours.open} – {shop.openingHours.close}</span>}
                          {shop.priceRange && <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7rem' }}>{shop.priceRange}</Badge>}
                        </div>
                        {shop.famousDishes?.length > 0 && (
                          <div className="mt-2">
                            {shop.famousDishes.map((dish, i) => (
                              <div key={i} className="d-flex justify-content-between mt-1" style={{ fontSize: '0.85rem' }}>
                                <span>{dish.name}</span>
                                <span style={{ color: 'var(--primary)' }}>₹{dish.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default HiddenGemsPage;
