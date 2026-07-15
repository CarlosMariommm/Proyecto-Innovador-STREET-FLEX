import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, danger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className={`confirm-icon-wrap ${danger ? 'danger' : 'warning'}`}>
          <AlertTriangle size={28} />
        </div>
        <div className="confirm-body">
          <h3 className="confirm-title">{title}</h3>
          <p className="confirm-message">{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`confirm-btn-ok ${danger ? 'danger' : 'warning'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
