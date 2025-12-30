import React, { useState } from 'react';
import api from '../services/api';
import './AdminPanel.css';

interface User { _id: string; name: string; phone: string; role?: string; }
interface HistoryItem {
  _id: string;
  user_id?: { name: string, _id: string } | string;
  category_id: string;
  sub_category_id: string;
  prompt: string;
  response: string;
  created_at: string;
}

interface AdminPanelProps {
  users: User[];
  history: HistoryItem[];
  categories: { _id: string, name: string }[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, history, categories, searchTerm, setSearchTerm }) => {
  const [view, setView] = useState<'menu' | 'users' | 'history' | 'addCategory' | 'addSub'>('menu');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  
  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState('');

  const goBack = () => { 
    setView('menu'); 
    setSearchTerm(''); 
    setSelectedResponse(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u._id.includes(searchTerm)
  );

  const handleAddCategory = async () => {
    if (!newCatName) return alert("נא להזין שם קטגוריה");
    try {
      await api.post('/categories', { name: newCatName });
      alert("הקטגוריה נוספה בהצלחה");
      window.location.reload();
    } catch (err) { alert("שגיאה בהוספת קטגוריה"); }
  };

  const handleAddSubCategory = async () => {
    if (!newSubName || !selectedParentCat) return alert("נא למלא את כל השדות");
    try {
      await api.post('/sub-categories', { name: newSubName, category_id: selectedParentCat });
      alert("תת-הקטגוריה נוספה בהצלחה");
      window.location.reload();
    } catch (err) { alert("שגיאה בהוספת תת-קטגוריה"); }
  };

  return (
    <div className="admin-panel-container">
      
      {view === 'menu' && (
        <div className="admin-menu-grid">
          <button className="menu-card" onClick={() => setView('users')}>ניהול משתמשים</button>
          <button className="menu-card" onClick={() => setView('history')}>היסטוריה גלובלית</button>
          <button className="menu-card" onClick={() => setView('addCategory')}>הוספת קטגוריה</button>
          <button className="menu-card" onClick={() => setView('addSub')}>הוספת תת-קטגוריה</button>
        </div>
      )}

      {view === 'users' && (
        <div className="admin-section">
          <div className="section-header">
            <button className="btn-back" onClick={goBack}>חזור</button>
            <h3>רשימת משתמשים</h3>
            <input 
              type="text" placeholder="חפש משתמש..." 
              className="search-input" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>שם</th><th>ת"ז</th><th>טלפון</th><th>תפקיד</th></tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u._id}</td>
                  <td>{u.phone}</td>
                  <td><span className={`role-badge ${u.role || 'user'}`}>{u.role || 'user'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'history' && (
        <div className="admin-section">
          <div className="section-header">
            <button className="btn-back" onClick={goBack}>חזור</button>
            <h3>היסטוריית למידה</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>משתמש</th>
                <th>תחום</th>
                <th>נושא</th>
                <th>תוכן</th>
                <th>תאריך</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item._id}>
                  <td>{typeof item.user_id === 'object' ? item.user_id?.name : 'משתמש'}</td>
                  <td>{item.category_id}</td>
                  <td>{item.sub_category_id}</td>
                  <td>
                    <button className="btn-view-content" onClick={() => setSelectedResponse(item.response)}>
                      צפה בשיעור
                    </button>
                  </td>
                  <td>{new Date(item.created_at).toLocaleDateString('he-IL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'addCategory' && (
        <div className="admin-section">
          <button className="btn-back" onClick={goBack}>חזור</button>
          <h3>הוספת קטגוריה חדשה</h3>
          <div className="admin-form">
            <input type="text" className="styled-input" placeholder="שם הקטגוריה" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
            <button className="btn-save" onClick={handleAddCategory}>שמור</button>
          </div>
        </div>
      )}

      {view === 'addSub' && (
        <div className="admin-section">
          <button className="btn-back" onClick={goBack}>חזור</button>
          <h3>הוספת תת-קטגוריה</h3>
          <div className="admin-form">
            <select className="styled-input" value={selectedParentCat} onChange={(e) => setSelectedParentCat(e.target.value)}>
              <option value="">בחר קטגוריית אם</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="text" className="styled-input" placeholder="שם התת-קטגוריה" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} />
            <button className="btn-save" onClick={handleAddSubCategory}>שמור</button>
          </div>
        </div>
      )}

      {selectedResponse && (
        <div className="modal-overlay" onClick={() => setSelectedResponse(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>תוכן השיעור</h4>
              <button className="close-btn" onClick={() => setSelectedResponse(null)}>X</button>
            </div>
            <div className="modal-body">
              {(() => {
                try {
                  const parsed = JSON.parse(selectedResponse);
                  return (
                    <div className="response-data">
                      <p><strong>הסבר:</strong></p>
                      <p>{parsed.explanation}</p>
                      <div className="divider"></div>
                      <p><strong>משימה:</strong></p>
                      <p>{parsed.task}</p>
                    </div>
                  );
                } catch (e) {
                  return <p>{selectedResponse}</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;