import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AIResponseDisplay from '../../components/AIResponseDisplay/AIResponseDisplay'; 
import './HistoryPage.css'; 


interface HistoryItem {
  _id: string;
  category_id: string;      
  sub_category_id: string; 
  prompt: string;
  response: string;         
  created_at: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/auth');
        return;
      }

      const user = JSON.parse(storedUser);

      try {
       
        const res = await api.get(`/ai/history/${user._id}`);
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-container">
      
      <header className="history-header">
        <h1> היסטוריית למידה</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          חזרה לדאשבורד
        </button>
      </header>

      {loading ? (
        <p>טוען נתונים...</p>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3>עדיין אין לך היסטוריה.</h3>
          <p>זה הזמן ליצור את השיעור הראשון שלך בדאשבורד!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => {
           
            let parsedContent = { explanation: '', task: '' };
            try {
              parsedContent = JSON.parse(item.response);
            } catch (e) {
              parsedContent = { explanation: 'שגיאה בטעינת התוכן', task: '' };
            }

            return (
              <div key={item._id} className="history-item">
                <div className="item-header">
                  <span className="category-badge">
                    {item.category_id} &gt; {item.sub_category_id}
                  </span>
                  <span className="date-text">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                
                <p className="prompt-text">
                  <strong>הבקשה שלך:</strong> {item.prompt}
                </p>
                
               
                <AIResponseDisplay 
                  explanation={parsedContent.explanation} 
                  task={parsedContent.task} 
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;