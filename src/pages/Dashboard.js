import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data to fill the 3-column grid for your screenshot
  const mockNotes = [
    { id: 1, title: 'Project Brainstorming', content: 'Discussed marketing strategies for Q4 launch, identified key stakeholders, and outlined initial deliverables. Reviewed competitive landscape and target audience demographics.', date: 'November 15, 2023' },
    { id: 2, title: 'Meeting Notes: Q3 Sync', content: 'Reviewed Q3 performance metrics, noted areas for improvement in customer satisfaction scores, and set goals for Q4. Action items assigned to various team leads.', date: 'November 10, 2023' },
    { id: 3, title: 'Client Feedback Session', content: 'Collected feedback from major client. Key takeaways included requests for new features, UI/UX improvements, and performance optimizations. Prioritized critical issues.', date: 'November 08, 2023' },
    { id: 4, title: 'Research: AI in Healthcare', content: 'Explored emerging trends in artificial intelligence applications within the healthcare sector. Focused on diagnostic tools, personalized medicine, and data analytics.', date: 'November 05, 2023' },
    { id: 5, title: 'Onboarding Checklist: New Hire', content: 'Created a comprehensive checklist for new employee onboarding, covering IT setup, HR paperwork, team introductions, and initial training modules. Ensured all steps are clear.', date: 'October 30, 2023' },
    { id: 6, title: 'Weekly Standup Summary', content: 'Summarized team progress on active tasks, highlighted blockers, and planned next steps. Reviewed individual contributions and ensured alignment with weekly objectives.', date: 'October 26, 2023' },
  ];

  const handleLogout = () => {
    // Later, you'll clear the auth token/ID here
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', padding: '2px 8px', fontWeight: 'bold', fontSize: '18px' }}>V</div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>VNote</h2>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px', padding: '8px 15px' }}>
            <span style={{ color: '#888', marginRight: '10px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search your notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', width: '100%', outline: 'none', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* User Avatar & Logout */}
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
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>Welcome back, John Doe.</h1>
          <Link to="/create-note" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span>+</span> Create Note
          </Link>
        </div>

        {/* Note Grid (3 Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {mockNotes.map(note => (
            <div key={note.id} style={{ backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              
              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>{note.title}</h3>
                {/* 2-line preview limit using webkit box */}
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {note.content}
                </p>
              </div>

              {/* Card Footer (Actions & Date) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Edit Icon */}
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontSize: '14px', padding: 0 }}>✏️</button>
                  {/* Delete Icon */}
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '14px', padding: 0 }}>🗑️</button>
                </div>
                <span style={{ fontSize: '11px', color: '#999', fontWeight: 'bold' }}>{note.date}</span>
              </div>
              
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}