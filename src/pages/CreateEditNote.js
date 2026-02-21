import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateEditNote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving note:", { title, content });
    // This is where you will add the Axios POST/PUT request to your Spring Boot API
    navigate('/dashboard'); // Redirect back to dashboard after saving
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Top Navigation Bar (Consistent with Dashboard) */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>VNote</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#007bff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            JD
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Back Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>&larr;</span> Back to Dashboard
          </Link>
        </div>

        {/* Note Editor Form Card */}
        <form onSubmit={handleSave} style={{ backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          
          {/* Title Input */}
          <input 
            type="text" 
            placeholder="Enter Note Title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px', boxSizing: 'border-box', outlineColor: '#007bff' }}
          />

          {/* Content Textarea */}
          <textarea 
            placeholder="Start typing your note here..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '100%', minHeight: '350px', padding: '15px', fontSize: '15px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px', boxSizing: 'border-box', outlineColor: '#007bff', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
          />

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
            <Link to="/dashboard" style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#555', textDecoration: 'none', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              Cancel
            </Link>
            {/* Primary Blue Save Button */}
            <button type="submit" style={{ padding: '10px 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}