import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../shared/components/NavBar';
import ConfirmationModal from '../../shared/components/ConfirmationModal';

export default function CreateEditNote() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const editingNote = location.state?.editNote || null;
  const initialMode = location.state?.mode || (editingNote ? 'edit' : 'create');

  const [mode, setMode] = useState(initialMode); 
  const [title, setTitle] = useState(editingNote ? editingNote.title : '');
  const [content, setContent] = useState(editingNote ? editingNote.content : '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Custom Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    isDanger: false,
    onConfirm: null
  });
  
  // User State for Header
  const [initials, setInitials] = useState('U');
  const [profileImage, setProfileImage] = useState(null);

  const isViewMode = mode === 'view';

  const hasUnsavedChanges = () => {
    const originalTitle = editingNote ? editingNote.title : '';
    const originalContent = editingNote ? editingNote.content : '';
    return title !== originalTitle || content !== originalContent;
  };

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

  const handleBackNavigation = (e) => {
    e.preventDefault();
    if (!isViewMode && hasUnsavedChanges()) {
      setModal({
        isOpen: true,
        title: 'Discard Unsaved Changes?',
        message: 'You have unsaved changes in this note. Are you sure you want to leave? Your changes will be lost.',
        confirmText: 'Discard Changes',
        isDanger: true,
        onConfirm: () => navigate('/dashboard')
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handleSaveIntent = (e) => {
    e.preventDefault();
    if (isViewMode) {
      setMode('edit');
      return;
    }
    if (!title.trim() || !content.trim()) return; 

    setModal({
      isOpen: true,
      title: mode === 'edit' ? 'Save Changes?' : 'Create New Note?',
      message: mode === 'edit' 
        ? 'Are you sure you want to overwrite this note with your new changes?' 
        : 'Are you ready to save this new note to your workspace?',
      confirmText: 'Save Note',
      isDanger: false,
      onConfirm: () => executeSave()
    });
  };

  const executeSave = async () => {
    setModal({ ...modal, isOpen: false }); 
    setIsSaving(true);

    const userId = localStorage.getItem('userId');
    if (!userId) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId: parseInt(userId) }),
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
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  const getPillText = () => {
    if (mode === 'view') return 'VIEW NOTE';
    if (mode === 'edit') return 'EDIT NOTE';
    return 'NEW NOTE';
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", sans-serif', position: 'relative' }}>
      
      {/* OUR NEW REUSABLE COMPONENT */}
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
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px', paddingLeft: '10px' }}>
          <button onClick={handleBackNavigation} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSaveIntent} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <span style={{ backgroundColor: isViewMode ? '#6c757d' : '#007bff', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {getPillText()}
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
            readOnly={isViewMode}
            style={{ width: '100%', padding: '0 0 15px 0', fontSize: '32px', fontWeight: 'bold', border: 'none', borderBottom: isViewMode ? '1px solid transparent' : '1px solid #eaeaea', marginBottom: '30px', color: '#222', outline: 'none', backgroundColor: 'transparent' }}
          />

          <textarea 
            placeholder="Start typing your note here..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            readOnly={isViewMode}
            style={{ width: '100%', flex: 1, padding: '0', fontSize: '16px', border: 'none', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.7', color: '#444', backgroundColor: 'transparent' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eaeaea', paddingTop: '20px', marginTop: '20px' }}>
            
            <div style={{ color: '#aaa', fontSize: '12px', fontWeight: '500' }}>
              {wordCount} words · {charCount} characters
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={handleBackNavigation} style={{ padding: '10px 24px', backgroundColor: '#f4f5f7', color: '#555', border: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.2s', cursor: 'pointer' }}>
                {isViewMode ? 'Close' : 'Cancel'}
              </button>
              
              {isViewMode ? (
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)' }}>
                  Edit Note
                </button>
              ) : (
                <button type="submit" disabled={isSaving} style={{ padding: '10px 24px', backgroundColor: isSaving ? '#ccc' : '#007bff', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)' }}>
                  {isSaving ? 'Saving...' : 'Save Note'}
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}