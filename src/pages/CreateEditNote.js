import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function CreateEditNote() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const editingNote = location.state?.editNote || null;

  const [title, setTitle] = useState(editingNote ? editingNote.title : '');
  const [content, setContent] = useState(editingNote ? editingNote.content : '');
  const [isSaving, setIsSaving] = useState(false);
  
  // User State for Header
  const [initials, setInitials] = useState('U');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8080/api/v1/users/${userId}`)
      .then(res => res.json())
      .then(userData => {
        if (userData && userData.fullName) {
          const nameParts = userData.fullName.split(' ');
          if (nameParts.length > 1) {
            setInitials((nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase());
          } else {
            setInitials(nameParts[0][0].toUpperCase());
          }
        } else if (userData && userData.username) {
          setInitials(userData.username[0].toUpperCase());
        }

        if (userData && userData.profileImage) {
          setProfileImage(`data:image/jpeg;base64,${userData.profileImage}`);
        }
      })
      .catch(err => console.error("Error fetching user profile:", err));
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Session expired. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const url = editingNote 
        ? `http://localhost:8080/api/v1/notes/${editingNote.noteId}` 
        : 'http://localhost:8080/api/v1/notes';
        
      const method = editingNote ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,
          userId: parseInt(userId) 
        }),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        alert("Failed to save the note. Please try again.");
      }
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Cannot connect to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '6px', padding: '4px 10px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a1a', fontWeight: 'bold' }}>VNote</h2>
        </div>

        {/* Search Bar Removed from here! Space-between will push the avatar to the right. */}

        {/* User Actions */}
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

          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px', paddingLeft: '10px' }}>
          <Link to="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSave} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <span style={{ backgroundColor: '#007bff', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {editingNote ? 'EDIT NOTE' : 'NEW NOTE'}
            </span>
            <span style={{ color: '#aaa', fontSize: '13px', fontWeight: '500' }}>
              {currentDate}
            </span>
          </div>

          <input 
            type="text" 
            placeholder="Enter Title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0 0 15px 0', fontSize: '32px', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #eaeaea', marginBottom: '30px', color: '#222', outline: 'none', backgroundColor: 'transparent' }}
          />

          <textarea 
            placeholder="Start typing your note here..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '100%', flex: 1, padding: '0', fontSize: '16px', border: 'none', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.7', color: '#444', backgroundColor: 'transparent' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eaeaea', paddingTop: '20px', marginTop: '20px' }}>
            
            <div style={{ color: '#aaa', fontSize: '12px', fontWeight: '500' }}>
              {wordCount} words · {charCount} characters
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/dashboard" style={{ padding: '10px 24px', backgroundColor: '#f4f5f7', color: '#555', textDecoration: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.2s' }}>
                Cancel
              </Link>
              <button type="submit" disabled={isSaving} style={{ padding: '10px 24px', backgroundColor: isSaving ? '#ccc' : '#007bff', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)' }}>
                {isSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>

          </div>

        </form>
      </main>
    </div>
  );
}