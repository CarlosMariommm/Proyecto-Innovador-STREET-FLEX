import React, { useState, useEffect } from 'react';
import EmployeeModal from '../../components/admin/EmployeeModal';
import { employeeService } from '../../api/employeeService';
import './SuppliersScreen.css'; // Mismo estilo base

const EmployeesScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getEmployees();
      setEmployees(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Error al cargar empleados. Verifica la conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">EMPLOYEES</h1>
        
        <div className="suppliers-actions">
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add Employee</button>
          <button className="btn-filter">Filters</button>
          <button className="btn-download">Download all</button>
        </div>
      </div>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Document</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading employees...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No employees found.</td></tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee._id || employee.id}>
                  <td>{employee.full_name}</td>
                  <td>{employee.username}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone_number || '-'}</td>
                  <td>{employee.single_document || '-'}</td>
                  <td className={`status-${employee.active ? 'green' : 'red'}`}>
                    {employee.active ? 'Active' : 'Inactive'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="suppliers-pagination">
        <button className="btn-page">Previous</button>
        <span>Page 1 of 1</span>
        <button className="btn-page">Next</button>
      </div>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEmployeeAdded={fetchEmployees}
      />
    </div>
  );
};

export default EmployeesScreen;
