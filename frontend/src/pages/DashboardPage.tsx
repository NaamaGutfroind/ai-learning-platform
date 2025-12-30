import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AIResponseDisplay from '../components/AIResponseDisplay';
import './DashboardPage.css';


interface Category { _id: string; name: string; }
interface SubCategory { _id: string; name: string; }
interface User { _id: string; name: string; }


interface AIResponseContent { 
  explanation: string; 
  task: string; 
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  

  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('');
  const [promptText, setPromptText] = useState('');
  
  const [aiResponse, setAiResponse] = useState<AIResponseContent | null>(null);
  const [loading, setLoading] = useState(false);

 
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

 
  const handleGenerate = async () => {
    if (!selectedCategoryId || !selectedSubCategoryName || !promptText) {
      alert('נא למלא את כל השדות');
      return;
    }

    setLoading(true);
    setAiResponse(null);

    try {
      
      const categoryName = categories.find(c => c._id === selectedCategoryId)?.name || '';

      const res = await api.post('/ai/generate', {
        user_id: user?._id,
        category_id: categoryName,
        sub_category_id: selectedSubCategoryName,
        prompt_text: promptText
      });

      
      const parsedResponse = JSON.parse(res.data.data.response);
      setAiResponse(parsedResponse);
      
    } catch (error) {
      console.error("Generation error:", error);
      alert("שגיאה ביצירת התוכן");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

 
  return (
    <div className="dashboard-container">
      
      <header className="dashboard-header">
        <h1 className="dashboard-title">שלום, {user?.name} </h1>
        <div className="header-actions">
          <button onClick={() => navigate('/history')} className="btn-history">
            היסטוריה
          </button>
          <button onClick={handleLogout} className="btn-logout">
            יציאה
          </button>
        </div>
      </header>

      <div className="form-container">
        <div className="selectors-row">
          <div className="selector-group">
            <label className="input-label">בחר תחום לימוד:</label>
            <select 
              className="styled-select"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubCategoryName('');
              }}
            >
              <option value="">-- בחר קטגוריה --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label className="input-label">בחר נושא ספציפי:</label>
            <select 
              className="styled-select"
              value={selectedSubCategoryName}
              onChange={(e) => setSelectedSubCategoryName(e.target.value)}
              disabled={!selectedCategoryId}
            >
              <option value="">-- בחר נושא --</option>
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub.name}>{sub.name}</option> 
              ))}
            </select>
          </div>
        </div>

        <div className="prompt-area">
          <label className="input-label">מה תרצה ללמוד בדיוק?</label>
          <textarea
            className="styled-textarea"
            placeholder="למשל: תסביר לי על הנושא, תן דוגמאות..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="btn-generate"
        >
          {loading ? 'ה-AI מכין את השיעור... ' : 'צור שיעור עכשיו! '}
        </button>
      </div>

     
      {aiResponse && (
        <AIResponseDisplay 
          explanation={aiResponse.explanation} 
          task={aiResponse.task} 
        />
      )}
      
    </div>
  );
};

export default DashboardPage;