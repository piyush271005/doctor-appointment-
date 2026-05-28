import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Users, RefreshCw } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { setLoading, showAlert } = useContext(UserContext);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLoading(false);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error loading users list', 'danger');
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>User Management Sheet</h3>
        </div>
        <button className="btn btn-secondary" onClick={getUsers} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>User Status</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {u._id.substring(0, 12)}
                </td>
                <td style={{ fontWeight: 700 }}>
                  {u.name}
                </td>
                <td>
                  {u.email}
                </td>
                <td>
                  <span className={`badge ${u.isDoctor || u.isAdmin ? 'badge-approved' : 'badge-pending'}`}>
                    Active
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {u.isAdmin ? 'Admin' : u.isDoctor ? 'Doctor' : 'User'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
