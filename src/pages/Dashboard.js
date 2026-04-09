import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal'; // Import our new reusable modal!
import NavBar from '../components/NavBar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);

  // User State for Header
  const [firstName, setFirstName] = useState('');
  const [initials, setInitials] = useState('U');
  const [profileImage, setProfileImage] = useState(null);

  // State to control our custom Modal
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    isDanger: false,
    onConfirm: null
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      navigate('/login');
      return;
    }

    // Fetch Notes
    fetch(`http://localhost:8080/api/v1/notes/user/${userId}`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));

    // Fetch User Profile
    fetch(`http://localhost:8080/api/v1/users/${userId}`)
      .then(res => res.json())
      .then(userData => {
        if (userData && userData.fullName) {
          const nameParts = userData.fullName.split(' ');
          setFirstName(nameParts[0]);
          
          if (nameParts.length > 1) {
            setInitials((nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase());
          } else {
            setInitials(nameParts[0][0].toUpperCase());
          }
        } else if (userData && userData.username) {
          setFirstName(userData.username);
          setInitials(userData.username[0].toUpperCase());
        }

        if (userData && userData.profileImage) {
          setProfileImage(`data:image/jpeg;base64,${userData.profileImage}`);
        }
      })
      .catch(err => console.error("Error fetching user profile:", err));
  }, [navigate]);

  // Intercepts the delete click and opens the modal
  const handleDeleteRequest = (noteId, e) => {
    e.stopPropagation(); // Stops the click from opening the note in "View Mode"
    setModal({
      isOpen: true,
      title: 'Delete Note?',
      message: 'Are you sure you want to permanently delete this note? This action cannot be undone.',
      confirmText: 'Delete Note',
      isDanger: true,
      onConfirm: () => executeDelete(noteId) 
    });
  };

  // Does the actual deleting after they confirm
  const executeDelete = async (noteId) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      const response = await fetch(`http://localhost:8080/api/v1/notes/${noteId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNotes(notes.filter(note => note.noteId !== noteId));
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleView = (note) => {
    navigate('/create-note', { state: { editNote: note, mode: 'view' } });
  };

  const handleEdit = (note, e) => {
    e.stopPropagation();
    navigate('/create-note', { state: { editNote: note, mode: 'edit' } });
  };

  // Intercepts the logout click
  const handleLogoutIntent = () => {
    setModal({
      isOpen: true,
      title: 'Log Out?',
      message: 'Are you sure you want to log out of your account?',
      confirmText: 'Log Out',
      isDanger: true,
      onConfirm: () => executeLogout()
    });
  };

  // Actually logs the user out
  const executeLogout = () => {
    setModal({ ...modal, isOpen: false });
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const timeGreeting = getGreeting();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", sans-serif', position: 'relative' }}>
      
      {/* OUR REUSABLE MODAL */}
      <ConfirmationModal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        isDanger={modal.isDanger}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ ...modal, isOpen: false })}
      />

      {/* Top Navigation Bar */}
      <NavBar 
        profileImage={profileImage}
        initials={initials}
        onLogout={handleLogoutIntent}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main style={{ padding: '50px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '14px', fontWeight: '500' }}>{today}</p>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#222', letterSpacing: '-0.5px' }}>
              {timeGreeting}, {firstName || 'User'}.
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>You have <strong>{notes.length}</strong> notes in your workspace.</p>
          </div>
          
          <Link to="/create-note" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '30px', fontSize: '15px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0, 123, 255, 0.25)' }}>
            <span>+</span> Create New Note
          </Link>
        </div>

        {filteredNotes.length === 0 ? (
           <p style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>No notes found. Create your first one!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {filteredNotes.map(note => (
              <div key={note.noteId} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', transition: 'transform 0.2s', cursor: 'pointer' }}
                   onClick={() => handleView(note)}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: '#222' }}>{note.title}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.content}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#aaa', fontWeight: '500' }}>
                    {new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    
                    <button onClick={(e) => handleEdit(note, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0b0b0', padding: 0, display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>

                    <button onClick={(e) => handleDeleteRequest(note.noteId, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0b0b0', padding: 0, display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}