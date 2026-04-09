import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from './Logo'; // Make sure this path is correct!

export default function NavBar({ 
  profileImage, 
  initials, 
  onLogout, 
  searchQuery = '', 
  setSearchQuery = () => {} 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show the search bar if we are on the dashboard
  const showSearch = location.pathname === '/dashboard';

  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* 1. Logo (Clickable to go home) */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>

      {/* 2. Search Bar (Conditional) */}
      {showSearch && (
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f4f5f7', borderRadius: '20px', padding: '10px 20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', width: '100%', outline: 'none', fontSize: '14px', color: '#333' }}
            />
          </div>
        </div>
      )}

      {/* 3. User Actions (Profile & Logout) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div 
          onClick={() => navigate('/profile')}
          title="Go to Profile"
          style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#007bff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            initials
          )}
        </div>

        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}