import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Bell, CheckSquare, Trash2, MailOpen } from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('unread');
  const { user, getUser, setLoading, showAlert } = useContext(UserContext);
  const navigate = useNavigate();

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/user/get-all-notification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);
      
      if (res.data.success) {
        showAlert(res.data.message || 'All notifications marked as read', 'success');
        await getUser();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error marking notifications', 'danger');
    }
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        '/api/v1/user/delete-all-notification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLoading(false);
      
      if (res.data.success) {
        showAlert(res.data.message || 'All notifications deleted', 'success');
        await getUser();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      showAlert('Error deleting notifications', 'danger');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Tabs */}
      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({user?.notification?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => setActiveTab('read')}
        >
          Read ({user?.seennotification?.length || 0})
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'unread' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell style={{ width: 18, height: 18, color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Unread Alerts</h3>
              </div>
              {user?.notification?.length > 0 && (
                <button className="btn btn-secondary" onClick={handleMarkAllRead} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <CheckSquare style={{ width: 14, height: 14 }} /> Mark all read
                </button>
              )}
            </div>

            {user?.notification?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <MailOpen style={{ width: 48, height: 48, margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No new notifications at this time.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {user?.notification?.map((notificationMsg, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{ padding: '1.2rem', cursor: notificationMsg.onClickPath ? 'pointer' : 'default', borderLeft: '3px solid var(--color-primary)', background: 'rgba(99, 102, 241, 0.03)' }}
                    onClick={() => {
                      if (notificationMsg.onClickPath) {
                        navigate(notificationMsg.onClickPath);
                      }
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{notificationMsg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare style={{ width: 18, height: 18, color: 'var(--color-success)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Archived Alerts</h3>
              </div>
              {user?.seennotification?.length > 0 && (
                <button className="btn btn-danger" onClick={handleDeleteAll} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Trash2 style={{ width: 14, height: 14 }} /> Delete all
                </button>
              )}
            </div>

            {user?.seennotification?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <Trash2 style={{ width: 48, height: 48, margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>No read notifications.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {user?.seennotification?.map((notificationMsg, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{ padding: '1.2rem', cursor: notificationMsg.onClickPath ? 'pointer' : 'default', opacity: 0.8 }}
                    onClick={() => {
                      if (notificationMsg.onClickPath) {
                        navigate(notificationMsg.onClickPath);
                      }
                    }}
                  >
                    <p style={{ fontSize: '0.95rem' }}>{notificationMsg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
