import React, { useState, useEffect } from 'react';
import { clientService } from '../../api/clientService';
import { useToast } from '../../hooks/useToast';
import { Trash2, User } from 'lucide-react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import './ClientsScreen.css';

const ClientsScreen = () => {
  const { showToast } = useToast();
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, clientId: null, clientName: '' });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await clientService.getClients();
      const data = res?.data || [];
      setClients(data);
      setFiltered(data);
    } catch (err) {
      setError('Error loading clients.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  useEffect(() => {
    let result = [...clients];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.username?.toLowerCase().includes(q)
      );
    }
    if (filterVerified === 'verified') result = result.filter(c => c.verified === true);
    if (filterVerified === 'unverified') result = result.filter(c => !c.verified);
    if (filterVerified === 'active') result = result.filter(c => c.active === true);
    if (filterVerified === 'inactive') result = result.filter(c => c.active === false);
    setFiltered(result);
  }, [searchQuery, filterVerified, clients]);

  const handleDeleteClick = (id, name) => {
    setConfirmDialog({ isOpen: true, clientId: id, clientName: name });
  };

  const handleConfirmDelete = async () => {
    const { clientId, clientName } = confirmDialog;
    setConfirmDialog({ isOpen: false, clientId: null, clientName: '' });
    
    try {
      await clientService.deleteClient(clientId);
      showToast(`Client "${clientName}" deleted.`, 'success');
      fetchClients();
    } catch (err) {
      showToast('Failed to delete client.', 'error');
      console.error(err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, clientId: null, clientName: '' });
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="clients-title">CLIENTS</h1>
        <div className="clients-actions">
          <input
            type="text"
            placeholder="Search by name, email or username..."
            className="filter-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="btn-filter" onClick={() => setShowFilters(v => !v)}>
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-bar">
          <div className="filter-group">
            <label>Status</label>
            <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)}>
              <option value="">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="btn-clear-filter" onClick={() => { setSearchQuery(''); setFilterVerified(''); }}>
            Clear Filters
          </button>
        </div>
      )}

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <div className="clients-stats">
        <span className="clients-count">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Username</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading clients...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No clients found.</td></tr>
            ) : (
              filtered.map(client => (
                <tr key={client._id}>
                  <td>
                    <div className="client-name-cell">
                      <div className="client-avatar">
                        {client.image ? (
                          <img src={client.image} alt={client.full_name} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <span>{client.full_name || '-'}</span>
                    </div>
                  </td>
                  <td>{client.email}</td>
                  <td>{client.username || '-'}</td>
                  <td>
                    <span className={`badge ${client.verified ? 'badge-verified' : 'badge-unverified'}`}>
                      {client.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${client.active !== false ? 'badge-active' : 'badge-inactive'}`}>
                      {client.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(client.createdAt)}</td>
                  <td>
                    <button
                      className="btn-delete-client"
                      onClick={() => handleDeleteClick(client._id, client.full_name || client.email)}
                      title="Delete client"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Client"
        message={`Are you sure you want to delete "${confirmDialog.clientName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        danger={true}
      />
    </div>
  );
};

export default ClientsScreen;
