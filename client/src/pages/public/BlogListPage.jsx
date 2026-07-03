import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { blogAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import AppNavbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Spinner from '../../components/common/Spinner';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAll({ search, page, limit: 9 });
      setBlogs(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, page]);

  return (
    <div>
      <AppNavbar />
      <div className="page-wrapper py-4" style={{ background: 'var(--bg-secondary)' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="section-title mb-1">✍️ Travel Stories</h2>
              <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>Real experiences from real travellers</p>
            </div>
            {user && <Link to="/blogs/write" className="btn btn-primary btn-sm">+ Write a Story</Link>}
          </div>

          <Form.Control
            placeholder="Search destinations or keywords..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="mb-4"
            style={{ maxWidth: 400 }}
          />

          {loading ? <Spinner /> : blogs.length === 0 ? (
            <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>No blog posts found.</div>
          ) : (
            <>
              <Row className="g-4">
                {blogs.map((blog) => (
                  <Col key={blog._id} sm={6} md={4}>
                    <Link to={`/blogs/${blog._id}`} style={{ textDecoration: 'none' }}>
                      <div className="tb-card h-100 p-4">
                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✈️</div>
                        <h5 className="fw-bold mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {blog.title}
                        </h5>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                          📍 {blog.destination}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {blog.content?.substring(0, 150)}...
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: '1px solid var(--border)', marginTop: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>By {blog.userId?.name}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
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
      <Footer />
    </div>
  );
};

export default BlogListPage;
