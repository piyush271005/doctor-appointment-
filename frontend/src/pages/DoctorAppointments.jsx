import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { UserContext } from '../context/UserContext';
import { Check, X, Calendar, RefreshCw } from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { setLoading, showAlert } = useContext(UserContext);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/doctor/doctor-appointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setLoading(false);
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error loading doctor appointments', 'danger');
    }
  };

  const handleStatus = async (appointment, status) => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/doctor/update-status',
        { 
          appointmentsId: appointment._id, 
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
        showAlert(`Appointment status updated to: ${status}`, 'success');
        getAppointments();
      } else {
        showAlert(res.data.message || 'Status update failed', 'danger');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error updating appointment status', 'danger');
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Patient Consultations Workspace</h3>
        <button className="btn btn-secondary" onClick={getAppointments} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <Calendar style={{ width: 48, height: 48, margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <p>No pending or scheduled patient booking requests found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Patient Name</th>
                <th>Patient Email</th>
                <th>Consulting Date</th>
                <th>Slot Time</th>
                <th>Status</th>
                <th>Action Controls</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {appointment._id.substring(0, 10)}...
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {appointment.userInfo.name}
                  </td>
                  <td>
                    {appointment.userInfo.email}
                  </td>
                  <td>
                    {moment(appointment.date).format('DD-MM-YYYY')}
                  </td>
                  <td>
                    {moment(appointment.time).format('HH:mm')}
                  </td>
                  <td>
                    <span className={`badge badge-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    {appointment.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          onClick={() => handleStatus(appointment, 'approved')}
                        >
                          <Check style={{ width: 14, height: 14 }} /> Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          onClick={() => handleStatus(appointment, 'rejected')}
                        >
                          <X style={{ width: 14, height: 14 }} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
