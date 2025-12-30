import React from 'react';
import AIResponseDisplay from './AIResponseDisplay';
import './LearningForm.css'; 

interface Category { _id: string; name: string; }
interface SubCategory { _id: string; name: string; }
interface AIResponseContent { explanation: string; task: string; }

interface LearningFormProps {
  categories: Category[];
  subCategories: SubCategory[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedSubCategoryName: string;
  setSelectedSubCategoryName: (name: string) => void;
  promptText: string;
  setPromptText: (text: string) => void;
  onGenerate: () => void;
  loading: boolean;
  aiResponse: AIResponseContent | null;
}

const LearningForm: React.FC<LearningFormProps> = ({
  categories, subCategories, selectedCategoryId, setSelectedCategoryId,
  selectedSubCategoryName, setSelectedSubCategoryName, promptText, setPromptText,
  onGenerate, loading, aiResponse
}) => {
  return (
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
        <label className="input-label">מה תרצי ללמוד בדיוק?</label>
        <textarea
          className="styled-textarea"
          placeholder="למשל: תסביר לי , תן דוגמאות..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
      </div>

      <button onClick={onGenerate} disabled={loading} className="btn-generate">
        {loading ? 'ה-AI מכין את השיעור... ' : 'צור שיעור עכשיו! '}
      </button>

      {aiResponse && (
        <AIResponseDisplay explanation={aiResponse.explanation} task={aiResponse.task} />
      )}
    </div>
  );
};

export default LearningForm;