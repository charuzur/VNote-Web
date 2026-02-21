import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* Left Side: Graphic */}
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Lightbulb SVG - Now tinted with a subtle blue to match the theme */}
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v1" />
          <path d="M12 7v1" />
          <path d="M15.5 4.5l-.7.7" />
          <path d="M8.5 10.5l-.7.7" />
          <path d="M19.5 4.5l-.7.7" />
          <path d="M15.5 10.5l-.7.7" />
          <circle cx="12" cy="14" r="4" />
        </svg>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '350px', padding: '40px', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
              {/* Added Blue to the Logo Box */}
              <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>VNote</h2>
            </div>
            <h3 style={{ margin: 0, color: '#555', fontSize: '18px' }}>Welcome Back</h3>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
            </div>

            {/* Primary Blue Button */}
            <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
              Log in
            </button>
          </form>
          
          <p style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: '#666' }}>
            Don't have an account? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}