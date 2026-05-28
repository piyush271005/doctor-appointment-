import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { User, Briefcase, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const ApplyDoctor = () => {
  const [step, setStep] = useState(1);
  const { user, setLoading, showAlert } = useContext(UserContext);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    website: '',
    address: '',
    specialization: '',
    experience: '',
    feesPerConsultation: '',
    timingStart: '09:00',
    timingEnd: '18:00',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    // Basic validations
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
        return showAlert('Please fill out all required personal details', 'warning');
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Format timings into an array expected by backend schema [start, end]
      const submissionData = {
        ...formData,
        userId: user._id,
        timings: [formData.timingStart, formData.timingEnd],
      };

      const res = await axios.post(
        '/api/v1/user/apply-doctor',
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);
      
      if (res.data.success) {
        showAlert(res.data.message || 'Application Submitted!', 'success');
        navigate('/');
      } else {
        showAlert(res.data.message || 'Application failed', 'danger');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Connection issues or server error', 'danger');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Steps Indicator */}
      <div className="steps-container">
        <div className={`step-node ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>1</div>
        <div className={`step-node ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
        <div className={`step-node ${step === 3 ? 'active' : ''}`}>3</div>
      </div>

      <div className="glass-card">
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <User style={{ width: 24, height: 24, color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Personal Demographics</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="e.g. Elizabeth"
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
                  placeholder="e.g. Blackwell"
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
                  placeholder="+1 (555) 019-2834"
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
                  placeholder="www.drelizabeth.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label className="form-label">Clinic Address *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="42 Medical Center Blvd, Ste 400"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={nextStep}>
                Next Section <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <Briefcase style={{ width: 24, height: 24, color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Professional Background</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  className="form-input"
                  placeholder="e.g. Cardiology, Pediatrics"
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
                  placeholder="e.g. 10"
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
                  placeholder="e.g. 150"
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

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button className="btn btn-secondary" onClick={prevStep}>
                <ArrowLeft style={{ width: 16, height: 16 }} /> Back
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Review & Confirm <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle style={{ width: 64, height: 64, color: 'var(--color-success)', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Apply</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
              Please confirm all details are correct. Upon submission, our administrator team will audit your application profile within 24 hours.
            </p>

            <div className="glass-card" style={{ textAlign: 'left', marginBottom: '2.5rem', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Submission Summary</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> Dr. {formData.firstName} {formData.lastName}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Specialization:</span> {formData.specialization}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> {formData.phone}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Experience:</span> {formData.experience} Years</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Fee:</span> ${formData.feesPerConsultation}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Hours:</span> {formData.timingStart} - {formData.timingEnd}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={prevStep}>
                <ArrowLeft style={{ width: 16, height: 16 }} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyDoctor;
