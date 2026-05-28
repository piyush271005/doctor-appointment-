
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import {
  Home,
  Calendar,
  User,
  Users,
  UserCheck,
  Bell,
  LogOut,
  Activity,
  Briefcase
} from 'lucide-react';

const Layout = ({ children }) => {

  const { user, setUser, showAlert } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);

    if (showAlert) {
      showAlert('Logged out successfully!', 'success');
    }

    navigate('/login');
  };

  // ========================= USER MENU =========================

  const userMenu = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: Calendar
    },
    {
      name: 'Apply Doctor',
      path: '/apply-doctor',
      icon: Briefcase
    }
  ];

  // ========================= ADMIN MENU =========================

  const adminMenu = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users
    },
    {
      name: 'Doctors',
      path: '/admin/doctors',
      icon: UserCheck
    }
  ];

  // ========================= DOCTOR MENU =========================

  const doctorMenu = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Appointments',
      path: '/doctor-appointments',
      icon: Calendar
    },
    {
      name: 'Profile',
      path: user ? `/doctor/profile/${user._id}` : '#',
      icon: User
    }
  ];

  // ========================= MENU SELECTOR =========================

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  // ========================= PAGE TITLE =========================

  const getHeaderTitle = () => {

    const path = location.pathname;

    if (path === '/') return 'Dashboard';

    if (path === '/appointments')
      return 'My Appointments';

    if (path === '/apply-doctor')
      return 'Register as a Doctor';

    if (path === '/admin/users')
      return 'User Management';

    if (path === '/admin/doctors')
      return 'Doctor Registrations';

    if (path.startsWith('/doctor/profile'))
      return 'Doctor Profile Configuration';

    if (path === '/doctor-appointments')
      return 'Patient Booking Workspace';

    if (path === '/notification')
      return 'Notification Hub';

    if (path.startsWith('/doctor/book-appointment'))
      return 'Schedule Consultation';

    return 'CareSync Core';
  };

  // ========================= SAFE USERNAME =========================

  const userName = user?.name || 'User';

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="app-container">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <Activity
            className="menu-icon"
            style={{
              strokeWidth: 3,
              color: '#6366f1'
            }}
          />

          <span>CareSync</span>
        </div>

        {/* ================= MENU ================= */}

        <ul className="sidebar-menu">

          {menuToBeRendered.map((menu) => {

            const isActive =
              location.pathname === menu.path;

            const Icon = menu.icon;

            return (
              <li key={menu.name}>

                <Link
                  to={menu.path}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                >

                  <Icon className="menu-icon" />

                  <span>{menu.name}</span>

                </Link>

              </li>
            );
          })}

          {/* ================= NOTIFICATIONS ================= */}

          <li>

            <Link
              to="/notification"
              className={`menu-item ${
                location.pathname === '/notification'
                  ? 'active'
                  : ''
              }`}
            >

              <Bell className="menu-icon" />

              <span>Notifications</span>

            </Link>

          </li>

        </ul>

        {/* ================= USER CARD ================= */}

        <div
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--border-glass)',
            paddingTop: '1.5rem'
          }}
        >

          {user && (

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}
            >

              <div className="avatar">

                {userInitial}

              </div>

              <div
                style={{
                  overflow: 'hidden'
                }}
              >

                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >

                  {userName}

                </h4>

                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}
                >

                  {user?.isAdmin
                    ? 'Administrator'
                    : user?.isDoctor
                    ? 'Practitioner'
                    : 'Patient'}

                </p>

              </div>

            </div>
          )}

          {/* ================= LOGOUT ================= */}

          <button
            onClick={handleLogout}
            className="menu-item"
            style={{
              width: '100%',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >

            <LogOut
              className="menu-icon"
              style={{
                color: 'var(--color-danger)'
              }}
            />

            <span
              style={{
                color: 'var(--color-danger)'
              }}
            >

              Logout

            </span>

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* ================= HEADER ================= */}

        <header className="header">

          <h2 className="header-title">
            {getHeaderTitle()}
          </h2>

          <div className="header-user">

            {/* ================= NOTIFICATION BADGE ================= */}

            <div
              className="notification-badge-container"
              onClick={() => navigate('/notification')}
            >

              <Bell
                style={{
                  width: 18,
                  height: 18
                }}
              />

              {user?.notification?.length > 0 && (

                <span className="notification-count">

                  {user.notification.length}

                </span>
              )}

            </div>

            {/* ================= USER BADGE ================= */}

            <div
              className="user-profile-badge"
              onClick={() =>
                navigate(
                  user?.isDoctor
                    ? `/doctor/profile/${user._id}`
                    : '/'
                )
              }
            >

              <div
                className="avatar"
                style={{
                  width: 24,
                  height: 24,
                  fontSize: '0.75rem'
                }}
              >

                {userInitial}

              </div>

              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >

                {userName}

              </span>

            </div>

          </div>

        </header>

        {/* ================= PAGE CONTENT ================= */}

        <div className="content-body">

          {children}

        </div>

      </main>

    </div>
  );
};

export default Layout;

