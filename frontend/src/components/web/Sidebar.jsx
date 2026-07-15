import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { moduleService } from '../../api/moduleService';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const [modules, setModules] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchModules = async () => {
        try {
          const res = await moduleService.getModules();
          setModules(res.data || res);
        } catch (error) {
          console.error("Error fetching modules", error);
        }
      };
      fetchModules();
    }
  }, [isOpen]);

  const handleModuleClick = (modId) => {
    navigate(`/?module=${modId}`);
    onClose();
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
        aria-hidden={!isOpen}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <X size={32} strokeWidth={1} />
          </button>
        </div>

        <div className="sidebar-tabs" style={{ display: 'none' }}>
        </div>

        <div className="sidebar-search">
          <Search size={24} strokeWidth={1} />
          <input type="text" placeholder="" aria-label="Search items" />
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li key="all">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); onClose(); }}>
                TODOS LOS PRODUCTOS
              </a>
            </li>
            {modules.filter(m => m.active).map((module) => (
              <li key={module._id}>
                <a href={`#${module.name.toLowerCase()}`} onClick={(e) => { e.preventDefault(); handleModuleClick(module._id); }}>
                  {module.name.toUpperCase()}
                </a>
              </li>
            ))}
            {user && user.role === 'admin' && (
              <li key="admin-panel" style={{ marginTop: '2rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); onClose(); }} style={{ color: '#22c55e', fontWeight: 'bold' }}>
                  ADMIN PANEL
                </a>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
