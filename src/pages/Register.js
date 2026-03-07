import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. We build the exact package Spring Boot is begging for
      const userPayload = {
        fullName: fullName,
        username: username,    // If your React state is still called 'email', change this to: username: email
        passwordHash: password // Maps the password to the 'passwordHash' column
      };

      // 2. We send it to the backend
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) {
        // Handle existing username or backend validation errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed. Username already exist.');
      }

      console.log("Registration successful");
      // Optional: Add an alert so the user knows they need to log in now
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '380px', padding: '40px', backgroundColor: '#ffffff', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>VNote</h2>
          </div>
          <h3 style={{ margin: 0, color: '#555', fontSize: '18px' }}>Create Account</h3>
        </div>

        {/* Error Message Display */}
        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '12px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>

          <button type="submit" disabled={isLoading} style={{ backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}