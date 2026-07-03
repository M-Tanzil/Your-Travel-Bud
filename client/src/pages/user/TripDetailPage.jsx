import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Form, Tab, Nav } from 'react-bootstrap';
import { itineraryAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // list | map
  const [editingDay, setEditingDay] = useState(null);
  const [dayNote, setDayNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    itineraryAPI.getOne(id)
      .then((r) => setTrip(r.data.data))
      .catch(() => navigate('/my-trips'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveDayNote = async (dayIndex) => {
    setSaving(true);
    const updated = { ...trip };
    updated.days[dayIndex].notes = dayNote;
    try {
      const res = await itineraryAPI.update(id, { days: updated.days });
      setTrip(res.data.data);
      setEditingDay(null);
    } catch {}
    setSaving(false);
  };

  const handleMovePlaceUp = async (dayIdx, placeIdx) => {
    if (placeIdx === 0) return;
    const updated = { ...trip };
    const places = [...updated.days[dayIdx].places];
    [places[placeIdx - 1], places[placeIdx]] = [places[placeIdx], places[placeIdx - 1]];
    updated.days[dayIdx].places = places;
    const res = await itineraryAPI.update(id, { days: updated.days });
    setTrip(res.data.data);
  };

  const handleMovePlaceDown = async (dayIdx, placeIdx) => {
    const updated = { ...trip };
    const places = [...updated.days[dayIdx].places];
    if (placeIdx === places.length - 1) return;
    [places[placeIdx], places[placeIdx + 1]] = [places[placeIdx + 1], places[placeIdx]];
    updated.days[dayIdx].places = places;
    const res = await itineraryAPI.update(id, { days: updated.days });
    setTrip(res.data.data);
  };

  const getDaysUntil = () => {
    const d = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));
    return d;
  };

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;
  if (!trip) return null;

  const daysUntil = getDaysUntil();

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <div>
            <button onClick={() => navigate('/my-trips')} className="btn btn-sm btn-outline-secondary mb-2">← Back</button>
            <h4 className="fw-bold mb-1">{trip.title}</h4>
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <Badge bg={{ upcoming: 'primary', ongoing: 'success', completed: 'secondary' }[trip.status]}>{trip.status}</Badge>
              {trip.isAIGenerated && <Badge bg="warning" text="dark">🤖 AI Generated</Badge>}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                📍 {trip.cityId?.name} · 📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button onClick={() => setViewMode(v => v === 'list' ? 'map' : 'list')} className="btn btn-outline-primary btn-sm">
              {viewMode === 'list' ? '🗺️ Map View' : '📋 List View'}
            </button>
          </div>
        </div>

        {/* Countdown */}
        {daysUntil > 0 && (
          <div className="countdown-box mb-4">
            <p className="mb-2" style={{ opacity: 0.85 }}>Your trip is coming up!</p>
            <div className="d-flex gap-3 justify-content-center">
              {[
                { val: Math.floor(daysUntil / 30), label: 'Months' },
                { val: daysUntil % 30, label: 'Days' },
              ].map((u) => (
                <div key={u.label} className="countdown-unit">
                  <div className="number">{u.val}</div>
                  <div className="label">{u.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Summary */}
        {trip.budget?.estimated > 0 && (
          <div className="tb-card p-3 mb-4">
            <h6 className="fw-bold mb-3">💰 Budget Breakdown</h6>
            <div className="d-flex gap-4 flex-wrap">
              {Object.entries(trip.budget).filter(([k]) => k !== 'currency' && k !== 'estimated').map(([key, val]) => val > 0 && (
                <div key={key}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{key}</div>
                  <div className="fw-bold">₹{val?.toLocaleString()}</div>
                </div>
              ))}
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Estimated</div>
                <div className="fw-bold" style={{ color: 'var(--primary)' }}>
                  ₹{(trip.budget.hotel + trip.budget.transport + trip.budget.food + trip.budget.activities)?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && trip.cityId?.coordinates && (
          <div className="mb-4">
            <iframe
              title="City Map"
              className="map-embed"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&q=${trip.cityId.name}`}
              allowFullScreen
            />
          </div>
        )}

        {/* Day Plans */}
        {trip.days?.map((day, dayIdx) => (
          <div key={dayIdx} className="day-card mb-3">
            <div className="day-header d-flex justify-content-between align-items-center">
              <span>Day {day.dayNumber} — {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <button
                onClick={() => { setEditingDay(dayIdx); setDayNote(day.notes || ''); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: 6, padding: '2px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                {day.notes ? '✏️ Edit Note' : '+ Add Note'}
              </button>
            </div>

            {/* Day Note */}
            {editingDay === dayIdx ? (
              <div className="p-3" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Add a note for this day..."
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                />
                <div className="d-flex gap-2 mt-2">
                  <button onClick={() => handleSaveDayNote(dayIdx)} disabled={saving} className="btn btn-primary btn-sm">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingDay(null)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                </div>
              </div>
            ) : day.notes && (
              <div className="px-3 py-2" style={{ background: '#fffbeb', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: '#92400e' }}>
                💡 {day.notes}
              </div>
            )}

            {/* Places */}
            {day.places?.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No places added yet for this day.
              </div>
            ) : day.places?.map((place, placeIdx) => (
              <div key={placeIdx} className="place-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button onClick={() => handleMovePlaceUp(dayIdx, placeIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1 }}>▲</button>
                  <button onClick={() => handleMovePlaceDown(dayIdx, placeIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1 }}>▼</button>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                  {placeIdx + 1}
                </div>
                <div className="flex-1">
                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                    {place.placeId?.name || 'Place'}
                  </div>
                  {place.notes && <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{place.notes}</div>}
                  {place.travelTimeFromPrev > 0 && (
                    <div style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>
                      🚗 {place.travelTimeFromPrev} min travel time
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetailPage;
