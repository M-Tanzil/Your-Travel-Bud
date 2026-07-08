import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { cityAPI, placeAPI, hotelAPI, hiddenGemAPI, adminAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';


// Generic CRUD table for admin content management
const AdminContentPage = ({ title, icon, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");

  const api = {
    cities: cityAPI,
    places: placeAPI,
    hotels: hotelAPI,
    hiddenGems: hiddenGemAPI,
    foodShops: { getAll: (p) => adminAPI.getFoodShops(p), create: adminAPI.createFoodShop, update: adminAPI.updateFoodShop, delete: adminAPI.deleteFoodShop },
    events: { getAll: (p) => adminAPI.getEvents(p), create: adminAPI.createEvent, update: adminAPI.updateEvent, delete: adminAPI.deleteEvent },
  }[type];

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getAll({ page, limit: 20 });
      setItems(res.data.data);
      setPagination(res.data.pagination || {});
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const openCreate = () => {
  setEditing(null);
  setForm({});
  setImage(null);
  setPreview("");
  setShowModal(true);
};
  const openEdit = (item) => {
  setEditing(item);
  setForm({ ...item });

  setImage(null);
  setPreview(item.photos?.[0]?.url || "");

  setShowModal(true);
};

 const handleSave = async () => {
  setSaving(true);

  try {
    const formData = new FormData();

    // Append all form fields
    Object.keys(form).forEach((key) => {
  const value = form[key];

  if (value !== undefined && value !== null) {
    if (
      typeof value === "object" &&
      !(value instanceof File) &&
      !Array.isArray(value)
    ) {
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  }
});

    // Append image if selected
    if (image) {
      formData.append("image", image);
    }

    if (editing) {
      await api.update(editing._id, formData);
    } else {
      await api.create(formData);
    }

    setShowModal(false);
    load();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to save");
  }

  setSaving(false);
};

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(id);
      load();
    } catch {}
  };

  const getFields = () => {
    switch (type) {
      case 'cities': return [
        { key: 'name', label: 'City Name', required: true },
        { key: 'country', label: 'Country', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'population', label: 'Population' },
        { key: 'language', label: 'Language' },
        { key: 'climate', label: 'Climate' },
        { key: 'bestSeason', label: 'Best Season', type: 'select', options: ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'] },
      ];
      case 'places': return [
        { key: 'name', label: 'Place Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'category', label: 'Category', type: 'select', options: ['Historical', 'Nature', 'Religious', 'Entertainment', 'Shopping', 'Food', 'Museum', 'Beach', 'Adventure', 'Other'] },
        { key: 'distanceFromCenter', label: 'Distance from Center (km)' },
        { key: 'bestTimeToVisit', label: 'Best Time to Visit' },
      ];
      case 'hotels': return [
        { key: 'name', label: 'Hotel Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'starRating', label: 'Star Rating (1-5)', type: 'number' },
        { key: 'priceRange', label: 'Price Range', type: 'select', options: ['budget', 'mid-range', 'luxury'] },
        { key: 'pricePerNight', label: 'Price Per Night (₹)', type: 'number' },
        { key: 'isVerified', label: 'Verified', type: 'checkbox' },
        { key: 'isFeatured', label: 'Featured', type: 'checkbox' },
      ];
      case 'hiddenGems': return [
        { key: 'name', label: 'Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'story', label: 'Local Story', type: 'textarea' },
        { key: 'hasExpertBadge', label: 'Expert Badge', type: 'checkbox' },
        { key: 'expertName', label: 'Expert Name' },
      ];
      case 'foodShops': return [
        { key: 'name', label: 'Shop Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'priceRange', label: 'Price Range', type: 'select', options: ['budget', 'mid-range', 'expensive'] },
      ];
      case 'events': return [
        { key: 'name', label: 'Event Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'startDate', label: 'Start Date', type: 'date', required: true },
        { key: 'endDate', label: 'End Date', type: 'date' },
        { key: 'category', label: 'Category', type: 'select', options: ['Festival', 'Cultural', 'Music', 'Food', 'Sports', 'Religious', 'Other'] },
      ];
      default: return [];
    }
  };

  const getDisplayValue = (item) => {
    switch (type) {
      case 'cities': return `${item.name}, ${item.country}`;
      case 'places': return item.category;
      case 'hotels': return `${item.starRating}★ · ${item.priceRange}`;
      case 'hiddenGems': return item.hasExpertBadge ? '⭐ Expert Pick' : 'Standard';
      case 'foodShops': return item.priceRange;
      case 'events': return item.startDate ? new Date(item.startDate).toLocaleDateString() : '—';
      default: return '';
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">{icon} {title}</h4>
          <Button className="btn-primary btn-sm" onClick={openCreate}>+ Add {title.slice(0, -1)}</Button>
        </div>

        {loading ? <Spinner /> : (
          <div className="tb-card">
            <Table responsive hover className="mb-0">
              <thead>
                <tr style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <th>Name</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.875rem' }}>
                {items.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No {title.toLowerCase()} found</td></tr>
                ) : items.map((item) => (
                  <tr key={item._id}>
                    <td className="fw-semibold">{item.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{getDisplayValue(item)}</td>
                    <td>
                      <Badge bg={item.isActive !== false ? 'success' : 'danger'}>
                        {item.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="btn btn-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {pagination.pages}</span>
            <button className="btn btn-outline-primary btn-sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editing ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {getFields().map((field) => (
              <Form.Group key={field.key} className="mb-3">
                <Form.Label>{field.label}{field.required && ' *'}</Form.Label>
                {field.type === 'textarea' ? (
                  <Form.Control as="textarea" rows={3} value={form[field.key] || ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required} />
                ) : field.type === 'select' ? (
                  <Form.Select value={form[field.key] || ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}>
                    <option value="">Select...</option>
                    {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </Form.Select>
                ) : field.type === 'checkbox' ? (
                  <Form.Check type="switch" checked={!!form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} label={`Enable ${field.label}`} />
                ) : (
                  <Form.Control type={field.type || 'text'} value={form[field.key] || ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required} />
                )}
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
  <Form.Label> {title.slice(0, -1)} Image</Form.Label>

  <Form.Control
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];

      if (!file) return;

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }}
  />
</Form.Group>

{preview && (
  <div className="text-center">
    <img
      src={preview}
      alt="Preview"
      style={{
        width: "250px",
        height: "170px",
        objectFit: "cover",
        borderRadius: "12px"
      }}
    />
  </div>
)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export const AdminCities = () => <AdminContentPage title="Cities" icon="🏙️" type="cities" />;
export const AdminPlaces = () => <AdminContentPage title="Places" icon="📍" type="places" />;
export const AdminHotels = () => <AdminContentPage title="Hotels" icon="🏨" type="hotels" />;
export const AdminHiddenGems = () => <AdminContentPage title="Hidden Gems" icon="💎" type="hiddenGems" />;
export const AdminFoodShops = () => <AdminContentPage title="Food Shops" icon="🍜" type="foodShops" />;
export const AdminEvents = () => <AdminContentPage title="Events" icon="🎉" type="events" />;
