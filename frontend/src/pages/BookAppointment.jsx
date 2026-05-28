import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { UserContext } from '../context/UserContext';
import { Calendar, Clock, DollarSign, Stethoscope, Check, AlertCircle } from 'lucide-react';

const BookAppointment = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user, setLoading, showAlert } = useContext(UserContext);
  const [doctor, setDoctor] = useState(null);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isAvailable, setIsAvailable] = useState(null); // null, true, false

  const getDoctorData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/doctor/getDoctorById',
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error loading doctor information', 'danger');
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  // Format date correctly
  const checkAvailability = async () => {
    if (!date || !time) {
      return showAlert('Please select a date and time', 'warning');
    }
    
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/user/booking-availability',
        { 
          doctorId: params.doctorId, 
          date, 
          time 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);

      if (res.data.success) {
        // Checking message content to evaluate exact availability
        const msg = res.data.message.toLowerCase();
        if (msg.includes('not available')) {
          setIsAvailable(false);
          showAlert(res.data.message, 'warning');
        } else {
          setIsAvailable(true);
          showAlert(res.data.message, 'success');
        }
      } else {
        setIsAvailable(false);
        showAlert(res.data.message || 'Consultation slot is not available', 'warning');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error checking slot availability', 'danger');
    }
  };

  const handleBook = async () => {
    if (!date || !time) {
      return showAlert('Date and time are required', 'warning');
    }

    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);

      if (res.data.success) {
        // Trigger confetti celebration!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        showAlert(res.data.message || 'Appointment booked successfully!', 'success');
        navigate('/appointments');
      } else {
        showAlert(res.data.message || 'Booking failed', 'danger');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error booking consultation', 'danger');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {doctor && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem' }}>
          {/* Doctor Bio Card */}
          <div className="glass-card doctor-card" style={{ height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div className="doctor-avatar" style={{ width: '80px', height: '80px', margin: '0 auto 1rem', fontSize: '2rem' }}>
                {doctor.firstName.charAt(0).toUpperCase()}
              </div>
              <h3 className="doctor-name" style={{ fontSize: '1.4rem' }}>Dr. {doctor.firstName} {doctor.lastName}</h3>
              <div className="doctor-specialization">{doctor.specialization}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Stethoscope style={{ width: 18, height: 18, color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience</div>
                  <div style={{ fontWeight: 700 }}>{doctor.experience} Years Practice</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <DollarSign style={{ width: 18, height: 18, color: 'var(--color-success)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consultation Fee</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>${doctor.feesPerConsultation}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Clock style={{ width: 18, height: 18, color: 'var(--color-warning)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Office Hours</div>
                  <div style={{ fontWeight: 700 }}>{doctor.timings[0]} - {doctor.timings[1]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedulers */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Schedule Appointment</h3>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Select Consultation Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  className="form-input"
                  style={{ paddingLeft: '2.8rem', width: '100%' }}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setIsAvailable(null);
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label className="form-label">Select Slot Time</label>
              <div style={{ position: 'relative' }}>
                <Clock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
                <input
                  type="time"
                  className="form-input"
                  style={{ paddingLeft: '2.8rem', width: '100%' }}
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setIsAvailable(null);
                  }}
                  required
                />
              </div>
            </div>

            {/* Availability Indicator */}
            {isAvailable !== null && (
              <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${isAvailable ? 'var(--color-success)' : 'var(--color-danger)'}`, background: 'rgba(10,12,22,0.4)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isAvailable ? (
                  <>
                    <Check style={{ color: 'var(--color-success)', width: 20, height: 20 }} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>This slot is available! You can proceed to confirm your booking.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle style={{ color: 'var(--color-danger)', width: 20, height: 20 }} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>This slot is already booked. Please choose another date or time.</span>
                  </>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={checkAvailability}
              >
                Check Availability
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleBook}
                disabled={isAvailable !== true}
              >
                Book Consultation Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
