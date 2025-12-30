import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null); 
    
    const endpoint = isLogin ? '/users/login' : '/users/register';
    
    try {
      const response = await api.post(endpoint, formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));

        setStatusMessage({
          type: 'success',
          text: isLogin ? 'התחברת בהצלחה! מעביר אותך...' : 'ההרשמה בוצעה בהצלחה! מעביר...'
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'קרתה שגיאה, נא לבדוק את הפרטים';
      setStatusMessage({
        type: 'error',
        text: message
      });
    }
  };

  return (
   
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h1 className="auth-title">{isLogin ? 'התחברות' : 'יצירת חשבון'}</h1>
        
        {statusMessage && (
          <StatusMessage type={statusMessage.type} text={statusMessage.text} />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            className="auth-input"
            type="text" 
            placeholder="שם מלא" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <input 
            className="auth-input"
            type="text" 
            placeholder="תעודת זהות" 
            value={formData.id}
            onChange={(e) => setFormData({...formData, id: e.target.value})}
            required 
          />
          <input 
            className="auth-input"
            type="text" 
            placeholder="מספר טלפון" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required 
          />
          
          <button type="submit" className="auth-btn">
            {isLogin ? 'כניסה למערכת' : 'להרשמה וקבלת גישה'}
          </button>
        </form>

        <div className="toggle-area">
          <span>{isLogin ? 'עדיין לא רשום?' : 'כבר יש לך חשבון?'}</span>
          <button 
            className="toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setStatusMessage(null);
            }} 
          >
            {isLogin ? 'צרי חשבון חדש' : 'התחבר כאן'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;