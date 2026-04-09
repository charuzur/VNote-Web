export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  isDanger = false, 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(3px)' }}>
      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: isDanger ? '#dc3545' : '#1a1a1a' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 24px 0', color: '#555', fontSize: '15px', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onCancel}
            style={{ padding: '10px 20px', backgroundColor: '#f4f5f7', color: '#444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            style={{ padding: '10px 20px', backgroundColor: isDanger ? '#dc3545' : '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: isDanger ? '0 4px 10px rgba(220, 53, 69, 0.2)' : '0 4px 10px rgba(0, 123, 255, 0.2)' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}