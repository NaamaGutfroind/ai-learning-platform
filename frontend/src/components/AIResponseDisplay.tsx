import React from 'react';


interface AIResponseDisplayProps {
  explanation: string;
  task: string;
}

const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({ explanation, task }) => {
  return (
    <div className="results-container">
      <h2 className="results-title"> הסבר הלימוד:</h2>
      <p className="results-text">{explanation}</p>
      
      <div className="divider"></div>
      
      <h2 className="task-title"> משימה לתרגול:</h2>
      <div className="task-box">
        <p className="task-text">{task}</p>
      </div>
    </div>
  );
};

export default AIResponseDisplay;