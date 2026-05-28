import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Briefcase, MapPin, User, Save, RefreshCw } from 'lucide-react';

const DoctorProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { setLoading, showAlert } = useContext(UserContext);
  const [formData, setFormData] = useState(null);

  const getDoctorInfo = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/doctor/getDoctorInfo',
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);
      
      if (res.data.success && res.data.data) {
        const doc = res.data.data;
        setFormData({
          firstName: doc.firstName,
          lastName: doc.lastName,
          phone: doc.phone,
          website: doc.website,
          address: doc.address,
          specialization: doc.specialization,
          experience: doc.experience,
          feesPerConsultation: doc.feesPerConsultation,
          timingStart: doc.timings ? doc.timings[0] : '09:00',
          timingEnd: doc.timings ? doc.timings[1] : '18:00',
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error loading doctor details', 'danger');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submissionData = {
        ...formData,
        userId: params.id,
        timings: [formData.timingStart, formData.timingEnd],
      };

      const res = await axios.post(
        '/api/v1/doctor/updateProfile',
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);

      if (res.data.success) {
        showAlert('Practitioner profile updated successfully!', 'success');
        navigate('/');
      } else {
        showAlert(res.data.message || 'Update failed', 'danger');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error saving profile changes', 'danger');
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {formData ? (
        <form onSubmit={handleSubmit} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <User style={{ width: 24, height: 24, color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Practitioner Profile Details</h3>
            </div>
            <button className="btn btn-primary" type="submit" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              <Save style={{ width: 16, height: 16 }} /> Save Changes
            </button>
          </div>

          {/* Section 1 */}
          <h4 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            <User style={{ width: 16, height: 16 }} /> Personal Details
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Website (Optional)</label>
              <input
                type="text"
                name="website"
                className="form-input"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">Clinic Address *</label>
            <div style={{ position: 'relative' }}>
              <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="address"
                className="form-input"
                style={{ paddingLeft: '2.8rem', width: '100%' }}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Section 2 */}
          <h4 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            <Briefcase style={{ width: 16, height: 16 }} /> Professional Details
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input
                type="text"
                name="specialization"
                className="form-input"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience *</label>
              <input
                type="number"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Consulting Fee ($USD) *</label>
              <input
                type="number"
                name="feesPerConsultation"
                className="form-input"
                value={formData.feesPerConsultation}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Hours From *</label>
                <input
                  type="time"
                  name="timingStart"
                  className="form-input"
                  value={formData.timingStart}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hours To *</label>
                <input
                  type="time"
                  name="timingEnd"
                  className="form-input"
                  value={formData.timingEnd}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="glass-card" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="menu-icon" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem', width: 36, height: 36 }} />
          <p>Loading your practitioner profile record...</p>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
