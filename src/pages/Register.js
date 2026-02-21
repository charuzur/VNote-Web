import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }
    console.log("Register attempt:", { fullName, email, password });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '380px', padding: '40px', backgroundColor: '#ffffff', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            {/* Added Blue to the Logo Box */}
            <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>VNote</h2>
          </div>
          <h3 style={{ margin: 0, color: '#555', fontSize: '18px' }}>Create Account</h3>
        </div>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', outlineColor: '#007bff' }} />
          </div>

          {/* Primary Blue Button */}
          <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            Sign Up
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}