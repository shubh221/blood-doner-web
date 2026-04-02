import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🩸 BloodLink
      </Link>
      <div style={styles.links}>
        {user ? (
          <>
            <span style={styles.greeting}>Hi, {user.name.split(' ')[0]}</span>
            <Link to="/search" style={styles.link}>Search Donors</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.linkPrimary}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '60px',
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#dc2626',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  greeting: { fontSize: '0.875rem', color: '#6b7280' },
  link: { fontSize: '0.875rem', color: '#374151', textDecoration: 'none' },
  linkPrimary: {
    fontSize: '0.875rem',
    color: '#fff',
    textDecoration: 'none',
    background: '#dc2626',
    padding: '6px 14px',
    borderRadius: '6px',
  },
  btn: {
    fontSize: '0.875rem',
    color: '#6b7280',
    background: 'none',
    border: '1px solid #e5e7eb',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
