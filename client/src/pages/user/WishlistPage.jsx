import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Badge } from 'react-bootstrap';
import { wishlistAPI } from '../../api';
import UserSidebar from '../../components/common/UserSidebar';
import Spinner from '../../components/common/Spinner';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await wishlistAPI.get();
      setWishlist(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (itemId) => {
    try {
      await wishlistAPI.remove(itemId);
      load();
    } catch {}
  };

  const addToTrip = (item) => {
    alert(`To add this to a trip, go to your trip planner and select this ${item.itemType}.`);
  };

  if (loading) return <div className="dashboard-layout"><UserSidebar /><div className="dashboard-content"><Spinner /></div></div>;

  const items = wishlist?.items || [];

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">❤️ My Wishlist</h4>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>❤️</div>
            <p style={{ color: 'var(--text-secondary)' }} className="mt-2">Your wishlist is empty</p>
            <Link to="/explore" className="btn btn-primary btn-sm mt-2">Explore Destinations</Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {items.length} saved item{items.length > 1 ? 's' : ''}
            </p>
            <Row className="g-4">
              {items.map((item) => (
                <Col key={item._id} sm={6} md={4}>
                  <div className="tb-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div style={{ fontSize: '2rem' }}>
                        {item.itemType === 'hotel' ? '🏨' : item.itemType === 'place' ? '📍' : '🍜'}
                      </div>
                      <Badge bg="secondary" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                        {item.itemType}
                      </Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                    <div className="d-flex gap-2">
                      <button onClick={() => addToTrip(item)} className="btn btn-primary btn-sm flex-1">
                        + Add to Trip
                      </button>
                      <button onClick={() => handleRemove(item._id)} className="btn btn-outline-danger btn-sm">
                        🗑️
                      </button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
