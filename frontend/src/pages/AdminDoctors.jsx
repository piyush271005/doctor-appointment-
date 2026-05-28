import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { UserCheck, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { setLoading, showAlert } = useContext(UserContext);

  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/admin/getAllDoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLoading(false);
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error loading doctors registration sheet', 'danger');
    }
  };

  const handleAccountStatus = async (doctor, status) => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/admin/changeAccountStatus',
        { 
          doctorId: doctor._id, 
          userId: doctor.userId, 
          status 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);

      if (res.data.success) {
        showAlert(`Application status updated to: ${status}`, 'success');
        getDoctors();
      } else {
        showAlert(res.data.message || 'Status transition failed', 'danger');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error transitioning registration status', 'danger');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Practitioner Registrations Audit</h3>
        </div>
        <button className="btn btn-secondary" onClick={getDoctors} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Medical Field</th>
              <th>Practice Exp.</th>
              <th>Hourly Rates</th>
              <th>Status</th>
              <th>Review Decisions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {doc._id.substring(0, 12)}
                </td>
                <td style={{ fontWeight: 700 }}>
                  Dr. {doc.firstName} {doc.lastName}
                </td>
                <td>
                  {doc.specialization}
                </td>
                <td>
                  {doc.experience} Years
                </td>
                <td style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                  ${doc.feesPerConsultation}/hr
                </td>
                <td>
                  <span className={`badge ${doc.status === 'approved' ? 'badge-approved' : 'badge-pending'}`}>
                    {doc.status}
                  </span>
                </td>
                <td>
                  {doc.status === 'pending' ? (
                    <button
                      className="btn btn-success"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleAccountStatus(doc, 'approved')}
                    >
                      <CheckCircle style={{ width: 14, height: 14 }} /> Approve Practitioner
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleAccountStatus(doc, 'pending')}
                    >
                      <XCircle style={{ width: 14, height: 14 }} /> Revoke Approval
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;
