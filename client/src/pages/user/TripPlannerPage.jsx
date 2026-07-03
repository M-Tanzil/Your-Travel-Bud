import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Tab, Nav, Alert } from 'react-bootstrap';
import { cityAPI, itineraryAPI, budgetAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const TripPlannerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup | plan
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [budget, setBudget] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);

  const [form, setForm] = useState({
    cityId: searchParams.get('cityId') || '',
    cityName: searchParams.get('city') || '',
    title: '',
    startDate: '',
    endDate: '',
    travelers: { adults: 1, children: 0 },
    mode: 'ai', // ai | manual
  });

  useEffect(() => {
    cityAPI.getAll({ limit: 50 }).then((r) => setCities(r.data.data)).catch(() => {});
  }, []);

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const getDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    return Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAIGenerate = async () => {
    if (!form.cityId || !form.startDate || !form.endDate) return alert('Please fill all fields');
    setAiLoading(true);
    try {
      const res = await itineraryAPI.aiGenerate({
        cityId: form.cityId,
        cityName: form.cityName,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: form.travelers,
      });
      setItinerary(res.data.data.itinerary);
      setAiPlan(res.data.data.aiPlan);

      // Estimate budget
      const budgetRes = await budgetAPI.estimate({
        days: getDays(),
        travelers: form.travelers,
      });
      setBudget(budgetRes.data.data);
      setStep('plan');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate itinerary');
    }
    setAiLoading(false);
  };

  const handleManualCreate = async () => {
    if (!form.cityId || !form.startDate || !form.endDate || !form.title) return alert('Please fill all fields');
    setLoading(true);
    try {
      const days = getDays();
      const daysArr = Array.from({ length: days }, (_, i) => ({
        dayNumber: i + 1,
        date: new Date(new Date(form.startDate).getTime() + i * 86400000),
        places: [],
        notes: '',
      }));
      const res = await itineraryAPI.create({
        cityId: form.cityId,
        title: form.title,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: form.travelers,
        days: daysArr,
      });
      navigate(`/my-trips/${res.data.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create trip');
    }
    setLoading(false);
  };

  const handleSaveAIPlan = async () => {
    if (itinerary?._id) navigate(`/my-trips/${itinerary._id}`);
  };

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">🗺️ Plan a Trip</h4>

        {step === 'setup' && (
          <Card className="tb-card p-4" style={{ maxWidth: 700 }}>
            <h5 className="fw-bold mb-4">Trip Details</h5>

            <Row className="g-3">
              <Col sm={12}>
                <Form.Label>Destination City *</Form.Label>
                <Form.Select
                  value={form.cityId}
                  onChange={(e) => {
                    const city = cities.find((c) => c._id === e.target.value);
                    handleChange('cityId', e.target.value);
                    handleChange('cityName', city?.name || '');
                  }}
                  required
                >
                  <option value="">Select a city...</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}, {city.country}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col sm={12}>
                <Form.Label>Trip Title</Form.Label>
                <Form.Control
                  placeholder="e.g. Jaipur Family Getaway"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </Col>

              <Col sm={6}>
                <Form.Label>Start Date *</Form.Label>
                <Form.Control type="date" value={form.startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => handleChange('startDate', e.target.value)} />
              </Col>
              <Col sm={6}>
                <Form.Label>End Date *</Form.Label>
                <Form.Control type="date" value={form.endDate} min={form.startDate} onChange={(e) => handleChange('endDate', e.target.value)} />
              </Col>

              {getDays() > 0 && (
                <Col sm={12}>
                  <Alert variant="info" className="py-2 mb-0" style={{ fontSize: '0.875rem' }}>
                    📅 {getDays()} day trip
                  </Alert>
                </Col>
              )}

              <Col sm={6}>
                <Form.Label>Adults</Form.Label>
                <Form.Control type="number" min={1} value={form.travelers.adults} onChange={(e) => handleChange('travelers', { ...form.travelers, adults: +e.target.value })} />
              </Col>
              <Col sm={6}>
                <Form.Label>Children</Form.Label>
                <Form.Control type="number" min={0} value={form.travelers.children} onChange={(e) => handleChange('travelers', { ...form.travelers, children: +e.target.value })} />
              </Col>

              <Col sm={12}>
                <Form.Label>Planning Mode</Form.Label>
                <div className="d-flex gap-3">
                  {[
                    { val: 'ai', icon: '🤖', label: 'AI Generate', desc: 'Let AI plan your complete itinerary' },
                    { val: 'manual', icon: '✍️', label: 'Manual', desc: 'Build your own day-by-day plan' },
                  ].map((mode) => (
                    <div
                      key={mode.val}
                      onClick={() => handleChange('mode', mode.val)}
                      className="tb-card p-3 flex-1 cursor-pointer"
                      style={{ border: form.mode === mode.val ? '2px solid var(--primary)' : '1px solid var(--border)', flex: 1, cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '1.5rem' }}>{mode.icon}</div>
                      <div className="fw-semibold mt-1">{mode.label}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{mode.desc}</div>
                    </div>
                  ))}
                </div>
              </Col>

              <Col sm={12}>
                {form.mode === 'ai' ? (
                  <Button className="btn-primary w-100 py-2" onClick={handleAIGenerate} disabled={aiLoading}>
                    {aiLoading ? '🤖 Generating your perfect plan...' : '🤖 Generate AI Itinerary'}
                  </Button>
                ) : (
                  <Button className="btn-primary w-100 py-2" onClick={handleManualCreate} disabled={loading}>
                    {loading ? 'Creating...' : '✍️ Create Manual Plan'}
                  </Button>
                )}
              </Col>
            </Row>
          </Card>
        )}

        {step === 'plan' && aiPlan && (
          <div>
            <div className="d-flex gap-3 align-items-center mb-4">
              <Button variant="outline-secondary" size="sm" onClick={() => setStep('setup')}>← Back</Button>
              <h5 className="fw-bold mb-0">{aiPlan.title}</h5>
            </div>

            <Alert variant="success" className="mb-4">
              🤖 AI has generated your {getDays()}-day itinerary! Review and save it to your trips.
            </Alert>

            <Row className="g-4">
              <Col md={8}>
                {aiPlan.days?.map((day) => (
                  <div key={day.dayNumber} className="day-card mb-3">
                    <div className="day-header">Day {day.dayNumber} — {day.theme}</div>
                    <div className="p-3">
                      {day.places?.map((place, i) => (
                        <div key={i} className="place-item">
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{place.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{place.category} · {place.estimatedDuration}</div>
                            {place.travelTimeFromPrev > 0 && (
                              <div style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>🚗 {place.travelTimeFromPrev} min from previous</div>
                            )}
                          </div>
                        </div>
                      ))}
                      {day.notes && <div className="px-3 py-2 mt-2" style={{ background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>💡 {day.notes}</div>}
                    </div>
                  </div>
                ))}
              </Col>

              <Col md={4}>
                {budget && (
                  <Card className="tb-card mb-3">
                    <Card.Body>
                      <h6 className="fw-bold mb-3">💰 Budget Estimate</h6>
                      {Object.entries(budget.breakdown).map(([key, val]) => (
                        <div key={key} className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
                          <span className="fw-semibold">₹{val.toLocaleString()}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total</span>
                        <span style={{ color: 'var(--primary)' }}>₹{budget.total.toLocaleString()}</span>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                <Card className="tb-card">
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Trip Summary</h6>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <p className="mb-1">📍 {form.cityName}</p>
                      <p className="mb-1">📅 {getDays()} days</p>
                      <p className="mb-1">👥 {form.travelers.adults} adults{form.travelers.children > 0 ? `, ${form.travelers.children} children` : ''}</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>{aiPlan.summary}</p>
                    <Button className="btn-primary w-100 mt-2" onClick={handleSaveAIPlan}>
                      ✅ Save Trip Plan
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlannerPage;
