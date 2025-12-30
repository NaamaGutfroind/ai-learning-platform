import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LearningForm from '../../components/LearningForm/LearningForm';
import AdminPanel from '../../components/AdminPanel/AdminPanel';
import './DashboardPage.css';

interface Category { _id: string; name: string; }
interface SubCategory { _id: string; name: string; }
interface User { _id: string; name: string; phone: string; role?: string; }

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
 
  const [user, setUser] = useState<User | null>(null);
  
 
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

 
  const [activeTab, setActiveTab] = useState<'personal' | 'admin'>('personal');
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminHistory, setAdminHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(storedUser));

    api.get('/categories')
      .then(res => setCategories(res.data.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, [navigate]);

 
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubCategories([]);
      return;
    }
    api.get(`/sub-categories/${selectedCategoryId}`)
      .then(res => setSubCategories(res.data))
      .catch(err => console.error("Error fetching sub-categories:", err));
  }, [selectedCategoryId]);

 
  useEffect(() => {
    if (activeTab === 'admin' && user?.role === 'admin') {
      api.get('/users').then(res => setAdminUsers(res.data.data));
      api.get('/ai/all').then(res => setAdminHistory(res.data.data));
    }
  }, [activeTab, user]);

 
  const handleGenerate = async () => {
    if (!selectedCategoryId || !selectedSubCategoryName || !promptText) {
      alert('נא למלא את כל השדות');
      return;
    }
    setLoading(true);
    try {
      const categoryName = categories.find(c => c._id === selectedCategoryId)?.name || '';
      const res = await api.post('/ai/generate', {
        user_id: user?._id,
        category_id: categoryName,
        sub_category_id: selectedSubCategoryName,
        prompt_text: promptText
      });

   
      setAiResponse(JSON.parse(res.data.data.response));

      //  איפוס שדה הטקסט לאחר הצלחה 
      setPromptText(''); 
      
    } catch (error) {
      alert("שגיאה ביצירת התוכן");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">שלום, {user?.name} </h1>
          {user?.role === 'admin' && <span className="admin-badge">מנהל מערכת</span>}
        </div>
        
        <div className="header-actions">
          {user?.role === 'admin' && (
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} 
                onClick={() => setActiveTab('personal')}
              > 
                למידה
              </button>
              <button 
                className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} 
                onClick={() => setActiveTab('admin')}
              > 
                ניהול
              </button>
            </div>
          )}
          <button onClick={() => navigate('/history')} className="btn-history">היסטוריה אישית</button>
          <button onClick={() => { localStorage.clear(); navigate('/auth'); }} className="btn-logout">יציאה</button>
        </div>
      </header>

     
      {activeTab === 'personal' ? (
        <LearningForm 
          categories={categories}
          subCategories={subCategories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedSubCategoryName={selectedSubCategoryName}
          setSelectedSubCategoryName={setSelectedSubCategoryName}
          promptText={promptText}
          setPromptText={setPromptText}
          onGenerate={handleGenerate}
          loading={loading}
          aiResponse={aiResponse}
        />
      ) : (
        <AdminPanel 
          users={adminUsers}
          history={adminHistory}
          categories={categories} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </div>
  );
};

export default DashboardPage;