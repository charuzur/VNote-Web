import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // User Data State (Used ONLY for Display)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [initials, setInitials] = useState('U');
  const [profileImage, setProfileImage] = useState(null);
  const [totalNotes, setTotalNotes] = useState(0);
  const [memberSince, setMemberSince] = useState('Loading...');
  
  // Form State (Temporary variables while typing)
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  
  // UI Interaction State
  const [activeForm, setActiveForm] = useState(null); 
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8080/api/v1/users/${userId}`)
      .then(res => res.json())
      .then(userData => {
        setFullName(userData.fullName || '');
        setUsername(userData.username || '');
        
        if (userData.createdAt) {
          const date = new Date(userData.createdAt);
          setMemberSince(date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
        } else {
          setMemberSince('Recently'); 
        }

        if (userData.profileImage) {
          setProfileImage(`data:image/jpeg;base64,${userData.profileImage}`);
        }
        if (userData.fullName) {
          const nameParts = userData.fullName.split(' ');
          setInitials(nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
            : nameParts[0][0].toUpperCase()
          );
        } else if (userData.username) {
          setInitials(userData.username[0].toUpperCase());
        }
      })
      .catch(err => console.error("Error fetching profile:", err));

    fetch(`http://localhost:8080/api/v1/notes/user/${userId}`)
      .then(res => res.json())
      .then(data => setTotalNotes(data.length || 0))
      .catch(err => console.error("Error fetching notes count:", err));
  }, [navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Send the temporary edit variables to the backend
        body: JSON.stringify({ fullName: editFullName, username: editUsername }),
      });

      if (response.ok) {
        showMessage('success', 'Profile updated successfully!');
        
        // ONLY update the official display text after success!
        setFullName(editFullName);
        setUsername(editUsername);
        
        // Update initials dynamically
        if (editFullName) {
          const nameParts = editFullName.split(' ');
          setInitials(nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
            : nameParts[0][0].toUpperCase()
          );
        } else if (editUsername) {
          setInitials(editUsername[0].toUpperCase());
        }

        setActiveForm(null); 
      } else {
        showMessage('error', 'Failed to update profile.');
      }
    } catch (err) {
      showMessage('error', 'Server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match!');
      return;
    }

    setIsLoading(true);
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword }), 
      });

      if (response.ok) {
        showMessage('success', 'Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveForm(null); 
      } else {
        showMessage('error', 'Failed to change password. Is your old password correct?');
      }
    } catch (err) {
      showMessage('error', 'Server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/photo`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showMessage('success', 'Profile photo updated!');
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        showMessage('error', 'Failed to upload photo.');
      }
    } catch (err) {
      showMessage('error', 'Server connection error.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '6px', padding: '4px 10px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a1a', fontWeight: 'bold' }}>VNote</h2>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            onClick={() => navigate('/profile')}
            title="Profile Settings"
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

      {/* Main Content Container */}
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <Link to="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {message.text && (
          <div style={{ maxWidth: '500px', margin: '0 auto 20px auto', padding: '12px 15px', borderRadius: '8px', textAlign: 'center', backgroundColor: message.type === 'error' ? '#fdecea' : '#e6f4ea', color: message.type === 'error' ? '#d93025' : '#137333', fontSize: '14px', fontWeight: '500', border: `1px solid ${message.type === 'error' ? '#fad2cf' : '#ceead6'}` }}>
            {message.text}
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          
          <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '16px', color: '#222', alignSelf: 'flex-start', fontWeight: '700' }}>Profile Details</h3>
            
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#007bff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', overflow: 'hidden', border: '3px solid #f4f5f7', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                title="Update Profile Picture"
                style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#1a1a1a', color: '#fff', border: '2px solid #fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
            
            <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#222', fontWeight: '700' }}>{fullName || 'User'}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '14px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              @{username || 'username'}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: 0 }} />

          <div style={{ padding: '25px 30px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Account Summary</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '13px', color: '#555' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Total Notes: <span style={{ backgroundColor: '#007bff', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' }}>{totalNotes}</span>
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '13px', color: '#555' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Member Since: <strong>{memberSince}</strong>
              </div>

            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: 0 }} />

          <div style={{ padding: '25px 30px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Account Management</h4>
            
            {activeForm === null && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <button 
                  // When clicking Edit Profile, we preload the form variables!
                  onClick={() => {
                    setEditFullName(fullName);
                    setEditUsername(username);
                    setActiveForm('editProfile');
                  }} 
                  style={{ width: '100%', padding: '12px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Profile
                </button>
                <button onClick={() => setActiveForm('changePassword')} style={{ background: 'none', border: 'none', color: '#007bff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Change Password
                </button>
              </div>
            )}

            {activeForm === 'editProfile' && (
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.3s ease-in-out' }}>
                <input type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} placeholder="Full Name" required style={{ width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outlineColor: '#007bff' }} />
                <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Username" required style={{ width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outlineColor: '#007bff' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setActiveForm(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#f4f5f7', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>Save Changes</button>
                </div>
              </form>
            )}

            {activeForm === 'changePassword' && (
              <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.3s ease-in-out' }}>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" required style={{ width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outlineColor: '#007bff' }} />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required style={{ width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outlineColor: '#007bff' }} />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required style={{ width: '100%', boxSizing: 'border-box', padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', outlineColor: '#007bff' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => { setActiveForm(null); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }} style={{ flex: 1, padding: '10px', backgroundColor: '#f4f5f7', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '10px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>Update Password</button>
                </div>
              </form>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: 0 }} />

          <div style={{ padding: '25px 30px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '11px', color: '#dc3545', fontWeight: 'bold', letterSpacing: '1px' }}>DANGER ZONE</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#f8d7da' }}></div>
             </div>
            <button onClick={() => alert("Delete account functionality to be implemented!")} style={{ width: '100%', padding: '12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(220,53,69,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Account
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}