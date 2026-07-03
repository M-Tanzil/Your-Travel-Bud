import { NavLink } from 'react-router-dom';

const adminLinks = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/cities', icon: '🏙️', label: 'Cities' },
  { to: '/admin/places', icon: '📍', label: 'Places' },
  { to: '/admin/hotels', icon: '🏨', label: 'Hotels' },
  { to: '/admin/hidden-gems', icon: '💎', label: 'Hidden Gems' },
  { to: '/admin/food-shops', icon: '🍜', label: 'Food Shops' },
  { to: '/admin/events', icon: '🎉', label: 'Events' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/bookings', icon: '📋', label: 'Bookings' },
  { to: '/admin/refunds', icon: '💰', label: 'Refunds' },
  { to: '/admin/blogs', icon: '📝', label: 'Blogs' },
  { to: '/admin/support', icon: '💬', label: 'Support' },
  { to: '/admin/announcements', icon: '📢', label: 'Announcements' },
  { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

const AdminSidebar = () => (
  <aside className="tb-sidebar">
    <div className="px-4 mb-3">
      <p className="mb-0 fw-bold" style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>⚡ Admin Panel</p>
    </div>
    <hr style={{ borderColor: 'var(--border)', margin: '0 1rem 1rem' }} />
    {adminLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === '/admin'}
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <span className="icon">{link.icon}</span>
        {link.label}
      </NavLink>
    ))}
  </aside>
);

export default AdminSidebar;
