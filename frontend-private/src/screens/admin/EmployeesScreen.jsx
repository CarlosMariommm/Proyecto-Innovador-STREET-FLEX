import React from 'react';
import './SuppliersScreen.css';

const MOCK_EMPLOYEES = [
  { id: 1, name: 'John Doe', role: 'Store Manager', email: 'john.doe@gmail.com', phone: '+1 234 567 8900', status: 'Active', statusColor: 'green' },
  { id: 2, name: 'Jane Smith', role: 'Sales Associate', email: 'jane.smith@gmail.com', phone: '+1 234 567 8901', status: 'Active', statusColor: 'green' },
  { id: 3, name: 'Michael Brown', role: 'Inventory Clerk', email: 'michael.b@gmail.com', phone: '+1 234 567 8902', status: 'Inactive', statusColor: 'red' },
  { id: 4, name: 'Emily Davis', role: 'Sales Associate', email: 'emily.d@gmail.com', phone: '+1 234 567 8903', status: 'Active', statusColor: 'green' },
  { id: 5, name: 'David Wilson', role: 'Security', email: 'david.w@gmail.com', phone: '+1 234 567 8904', status: 'Active', statusColor: 'green' },
];

const EmployeesScreen = () => {
  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">EMPLOYEES</h1>
        
        <div className="suppliers-actions">
          <button className="btn-add">Add Employee</button>
          <button className="btn-filter">Filters</button>
          <button className="btn-download">Download all</button>
        </div>
      </div>
      
      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EMPLOYEES.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td className={`status-${employee.statusColor}`}>{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="suppliers-pagination">
        <button className="btn-page">Previous</button>
        <span>Page 1 of 1</span>
        <button className="btn-page">Next</button>
      </div>
    </div>
  );
};

export default EmployeesScreen;
