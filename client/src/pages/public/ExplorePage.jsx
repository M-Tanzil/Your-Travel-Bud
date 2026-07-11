import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Badge } from 'react-bootstrap';
import { cityAPI, placeAPI, hotelAPI } from '../../api';
import Spinner from '../../components/common/Spinner';

const TABS = ['Cities', 'Places', 'Hotels'];

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(
  searchParams.get('tab') || 'Cities'
);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
 const [filters, setFilters] = useState({
  search: searchParams.get('search') || '',
  category: '',
  priceRange: '',
  cityId: searchParams.get('cityId') || '',
});
  
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      const params = { page, limit: 12, ...filters };
      if (tab === 'Cities') res = await cityAPI.getAll(params);
      else if (tab === 'Places') res = await placeAPI.getAll({ ...params, category: filters.category });
      else res = await hotelAPI.search({
    ...params,
    cityId: filters.cityId,
    priceRange: filters.priceRange,
  });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [tab, page, filters]);
  useEffect(() => {
  const urlTab = searchParams.get("tab");
  const cityId = searchParams.get("cityId");

  if (urlTab) {
    setTab(urlTab);
  }

  if (cityId) {
    setFilters((prev) => ({
      ...prev,
      cityId,
    }));
  }
}, [searchParams]);

  const handleFilter = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  return (
    <div className="page-wrapper py-4" style={{ background: 'var(--bg-secondary)' }}>
      <Container>
        <h2 className="section-title">Explore</h2>
        <p className="section-subtitle">Discover cities, places, and hotels across the world</p>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); setData([]); }}
              className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <Row className="g-3 mb-4">
          <Col sm={6} md={4}>
            <Form.Control
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </Col>
          {tab === 'Places' && (
            <Col sm={6} md={3}>
              <Form.Select value={filters.category} onChange={(e) => handleFilter('category', e.target.value)}>
                <option value="">All Categories</option>
                {['Historical', 'Nature', 'Religious', 'Entertainment', 'Beach', 'Museum', 'Adventure'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>
          )}
          {tab === 'Hotels' && (
            <Col sm={6} md={3}>
              <Form.Select value={filters.priceRange} onChange={(e) => handleFilter('priceRange', e.target.value)}>
                <option value="">All Price Ranges</option>
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-Range</option>
                <option value="luxury">Luxury</option>
              </Form.Select>
            </Col>
          )}
        </Row>

        {/* Results */}
        {loading ? <Spinner /> : (
          <>
            <Row className="g-4">
              {data.length === 0 ? (
                <Col><div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>No results found.</div></Col>
              ) : data.map((item) => (
                <Col key={item._id} sm={6} md={4}>
                  <Link
                    to={tab === 'Cities' ? `/city/${item._id}` : tab === 'Places' ? `/place/${item._id}` : `/hotel/${item._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="tb-card h-100">
                      <div style={{ height: 160, background: 'linear-gradient(135deg, #667eea, #764ba2)', position: 'relative' }}>
                        {(item.photos?.[0]?.url) && (
                          <img src={item.photos[0].url} alt={item.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="fw-bold mb-1">{item.name}</h6>
                          {item.rating > 0 && <span className="stars">⭐ {item.rating}</span>}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                          {item.country || item.cityId?.name || item.priceRange}
                        </p>
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                          {item.category && <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>{item.category}</Badge>}
                          {item.isVerified && <span className="badge-verified">✓ Verified</span>}
                          {item.isFeatured && <span className="badge-featured">Featured</span>}
                          {item.bestSeason && <Badge bg="primary" style={{ fontSize: '0.7rem' }}>Best: {item.bestSeason}</Badge>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="btn btn-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {pagination.pages}</span>
                <button className="btn btn-outline-primary btn-sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ExplorePage;
