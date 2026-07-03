import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/plan-trip', icon: '🗺️', label: 'Plan a Trip' },
  { to: '/my-trips', icon: '✈️', label: 'My Trips' },
  { to: '/my-bookings', icon: '🏨', label: 'My Bookings' },
  { to: '/wishlist', icon: '❤️', label: 'Wishlist' },
  { to: '/history', icon: '📊', label: 'Travel History' },
  { to: '/profile', icon: '👤', label: 'Profile' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
  { to: '/support', icon: '💬', label: 'Support' },
  { to: '/blogs/write', icon: '✍️', label: 'Write Blog' },
];

const UserSidebar = () => {
  const { user } = useAuth();
  return (
    <aside className="tb-sidebar">
      <div className="px-4 mb-3">
        <p className="mb-0 fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user?.name}</p>
        <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user?.email}</p>
      </div>
      <hr style={{ borderColor: 'var(--border)', margin: '0 1rem 1rem' }} />
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/dashboard'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="icon">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default UserSidebar;
