import React from 'react';

interface StatusMessageProps {
  type: 'error' | 'success';
  text: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, text }) => {
 
  const className = type === 'error' ? 'status-box status-error' : 'status-box status-success';

  return (
    <div className={className}>
      {text}
    </div>
  );
};

export default StatusMessage;