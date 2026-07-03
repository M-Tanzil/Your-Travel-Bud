import { useState, useEffect } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { blogAPI } from '../../api';
import AdminSidebar from '../../components/common/AdminSidebar';
import Spinner from '../../components/common/Spinner';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAll({ page, limit: 20 });
      setBlogs(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogAPI.delete(id);
      load();
    } catch {}
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="dashboard-content">
        <h4 className="fw-bold mb-4">📝 Blog Posts</h4>
        {loading ? <Spinner /> : (
          <>
            <div className="tb-card">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Destination</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.875rem' }}>
                  {blogs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No blog posts</td></tr>
                  ) : blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="fw-semibold" style={{ maxWidth: 250 }}>
                        <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {blog.title}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{blog.userId?.name}</td>
                      <td>📍 {blog.destination}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(blog._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {pagination.pages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="btn btn-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {pagination.pages}</span>
                <button className="btn btn-outline-primary btn-sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;
