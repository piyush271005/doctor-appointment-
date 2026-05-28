import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { UserContext } from '../context/UserContext';
import { Calendar, RefreshCw } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { setLoading, showAlert } = useContext(UserContext);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/user/user-appointments', {
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
      showAlert('Error loading appointments lists', 'danger');
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Consultation Schedule</h3>
        <button className="btn btn-secondary" onClick={getAppointments} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <Calendar style={{ width: 48, height: 48, margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <p>No active or historical appointments found on your profile.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Doctor</th>
                <th>Clinic Address</th>
                <th>Consultation Date</th>
                <th>Time Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {appointment._id.substring(0, 10)}...
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    Dr. {appointment.doctorInfo.firstName} {appointment.doctorInfo.lastName}
                  </td>
                  <td>
                    {appointment.doctorInfo.address}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
