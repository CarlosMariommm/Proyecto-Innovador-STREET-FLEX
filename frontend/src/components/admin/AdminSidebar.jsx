import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, Truck, Box } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/inventory', icon: Package },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Account', path: '/admin/account', icon: Settings },
    { name: 'Suppliers', path: '/admin/suppliers', icon: Truck },
    { name: 'Deliveries', path: '/admin/deliveries', icon: Box },
  ];

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        {!isCollapsed && <h2>STREET FLEX</h2>}
        <span 
          className="collapse-icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          «
        </span>
      </div>
      
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon size={20} className="admin-nav-icon" />
            {!isCollapsed && <span className="admin-nav-text">{item.name.toUpperCase()}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
