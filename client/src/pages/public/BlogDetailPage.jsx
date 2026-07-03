import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { blogAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import AppNavbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Spinner from '../../components/common/Spinner';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getOne(id)
      .then((r) => setBlog(r.data.data))
      .catch(() => navigate('/blogs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogAPI.delete(id);
      navigate('/blogs');
    } catch {}
  };

  if (loading) return <><AppNavbar /><Spinner fullPage /></>;
  if (!blog) return null;

  const isOwner = user?._id === blog.userId?._id || user?.id === blog.userId?._id;

  return (
    <div>
      <AppNavbar />
      <div className="page-wrapper py-4" style={{ background: 'var(--bg-secondary)' }}>
        <Container style={{ maxWidth: 800 }}>
          <Link to="/blogs" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>← Back to Stories</Link>

          <div className="tb-card p-4 mt-3">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
              <div>
                <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>📍 {blog.destination}</p>
                <h2 className="fw-bold">{blog.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  By <strong>{blog.userId?.name}</strong> · {new Date(blog.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {(isOwner || isAdmin) && (
                <div className="d-flex gap-2">
                  {isOwner && <Link to={`/blogs/edit/${id}`} className="btn btn-outline-primary btn-sm">Edit</Link>}
                  <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">Delete</button>
                </div>
              )}
            </div>

            <div style={{ lineHeight: 1.9, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {blog.content}
            </div>

            {blog.userId?.bio && (
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <h6 className="fw-bold">About the Author</h6>
                <div className="d-flex gap-3 align-items-center">
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {blog.userId?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="fw-semibold">{blog.userId?.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{blog.userId?.bio}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
