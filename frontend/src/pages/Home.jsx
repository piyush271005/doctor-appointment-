import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Search, Stethoscope, Star, Clock, UserCheck, Shield } from 'lucide-react';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const { user, setLoading, showAlert } = useContext(UserContext);
  const navigate = useNavigate();

  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/user/getAllDoctors', {
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
      showAlert('Error fetching doctor lists', 'danger');
    }
  };

  useEffect(() => {
    if (!user?.isAdmin && !user?.isDoctor) {
      getDoctors();
    }
  }, [user]);

  // Filter based on search query
  const filteredDoctors = doctors.filter((doc) => {
    const query = search.toLowerCase();
    return (
      doc.firstName.toLowerCase().includes(query) ||
      doc.lastName.toLowerCase().includes(query) ||
      doc.specialization.toLowerCase().includes(query)
    );
  });

  // Admin Dashboard landing state
  if (user?.isAdmin) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <Shield style={{ width: 80, height: 80, color: 'var(--color-primary)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Admin Control Center</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Welcome back to the portal. From here you can manage all user records, audit doctors registration requests, and maintain core application services. Use the sidebar to navigate to management sheets.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/users')}>
            Manage Users
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/doctors')}>
            Audit Registrations
          </button>
        </div>
      </div>
    );
  }

  // Doctor Dashboard landing state
  if (user?.isDoctor) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <UserCheck style={{ width: 80, height: 80, color: 'var(--color-success)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Welcome, Dr. {user.name}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          This is your doctor practitioner portal. Review scheduled appointments, manage active cases, and customize your consulting profiles under the settings.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/doctor-appointments')}>
            Active Consultations
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/doctor/profile/${user._id}`)}>
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05))', borderColor: 'var(--border-glass-active)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome, {user?.name}!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Find, verify, and consult premium medical practitioners in just a few clicks.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center' }}>
        <Search style={{ color: 'var(--text-muted)', marginRight: '1rem', width: 20, height: 20 }} />
        <input
          type="text"
          className="form-input"
          style={{ background: 'none', border: 'none', padding: 0, fontSize: '1rem', width: '100%', outline: 'none', boxShadow: 'none' }}
          placeholder="Search by practitioner name, specialized medical fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Stethoscope style={{ margin: '0 auto 1.5rem', width: 48, height: 48, color: 'var(--text-muted)', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Practitioners Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try modifying your keywords or search query.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="glass-card doctor-card">
              <div>
                <div className="doctor-card-header">
                  <div className="doctor-avatar">
                    {doc.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="doctor-name">Dr. {doc.firstName} {doc.lastName}</h3>
                    <div className="doctor-specialization">{doc.specialization}</div>
                  </div>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <div className="doctor-info-row">
                    <span className="doctor-info-label">Experience:</span>
                    <span className="doctor-info-value">{doc.experience} Years</span>
                  </div>
                  <div className="doctor-info-row">
                    <span className="doctor-info-label">Consulting Fee:</span>
                    <span className="doctor-info-value" style={{ color: 'var(--color-success)' }}>${doc.feesPerConsultation}</span>
                  </div>
                  <div className="doctor-info-row">
                    <span className="doctor-info-label">Hours:</span>
                    <span className="doctor-info-value">
                      <Clock style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                      {doc.timings[0]} - {doc.timings[1]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="doctor-card-footer">
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
