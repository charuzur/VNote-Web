import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const globalStyles = `
  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
`;

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const userPayload = {
        fullName: fullName,
        username: username,
        passwordHash: password 
      };

      const response = await fetch('https://vnote-backend.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed. Username already exists.');
      }

      setTimeout(() => {
          navigate('/login');
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', fontFamily: '"Inter", "Segoe UI", sans-serif', padding: '20px' }}>
        
        <div style={{ width: '100%', maxWidth: '400px', padding: '50px 40px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>V</div>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#1a1a1a', fontWeight: '700' }}>VNote</h2>
            </div>
            <h3 style={{ margin: 0, color: '#333', fontSize: '20px', fontWeight: '600' }}>Create Account</h3>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fdecea', color: '#d93025', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', border: '1px solid #fad2cf' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#555', fontWeight: '600' }}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', boxSizing: 'border-box', outlineColor: '#007bff', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#555', fontWeight: '600' }}>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', boxSizing: 'border-box', outlineColor: '#007bff', fontSize: '14px' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#555', fontWeight: '600' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 15px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #e0e0e0', boxSizing: 'border-box', outlineColor: '#007bff', fontSize: '14px' }} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex' }}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#555', fontWeight: '600' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 15px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #e0e0e0', boxSizing: 'border-box', outlineColor: '#007bff', fontSize: '14px' }} 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex' }}>
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input type="checkbox" id="terms" required style={{ cursor: 'pointer' }} />
              <label htmlFor="terms" style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                I agree to the <Link to="#" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>Terms & Conditions</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading} style={{ backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: '600', transition: 'background-color 0.2s', boxShadow: '0 4px 12px rgba(0,123,255,0.2)' }}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          
          <p style={{ marginTop: '25px', fontSize: '13px', textAlign: 'center', color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
          </p>

        </div>
      </div>
    </>
  );
}