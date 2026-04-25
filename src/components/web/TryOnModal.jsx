import React from 'react';
import { X, Camera } from 'lucide-react';
import './TryOnModal.css';

const TryOnModal = ({ isOpen, onClose, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="try-on-overlay">
      <div className="try-on-modal">
        <div className="try-on-header">
          <h3>VIRTUAL TRY-ON: {productName}</h3>
          <button className="close-try-on-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        
        <div className="try-on-body">
          <div className="camera-viewfinder">
            <div className="camera-corners top-left"></div>
            <div className="camera-corners top-right"></div>
            <div className="camera-corners bottom-left"></div>
            <div className="camera-corners bottom-right"></div>
            
            <div className="camera-instruction">
              <Camera size={48} className="camera-icon" />
              <p>Position yourself in the frame to try on</p>
              <button className="btn-enable-camera">Enable Camera</button>
            </div>
            
            {/* Si quisieras una silueta: */}
            <div className="silhouette-overlay"></div>
          </div>
          
          <div className="try-on-footer">
            <button className="btn-capture">Take Snapshot</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnModal;
