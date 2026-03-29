import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import '../styles/Profile.css';

const AVATAR_COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#2196f3',
  '#00bcd4',
  '#4caf50',
  '#ff9800',
  '#ff5722',
];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);

  if (!user) {
    return null; // or a loading spinner if desired
  }

  const initial = user.name.charAt(0).toUpperCase();
  const avatarBg = getAvatarColor(user.name);

  return (
    <div className="app-layout">
      {/* Keeping Sidebar for consistent navigation structure */}
      <Sidebar projects={projects} />
      
      <div className="app-main">
        <Header />
        
        <div className="app-content">
          <div className="profile-container fade-in">
            <div className="profile-header">
              <h1>My Profile</h1>
              <p>View your personal account information.</p>
            </div>

            <div className="profile-card">
              <div 
                className="profile-avatar-lg"
                style={{ background: avatarBg }}
              >
                {initial}
              </div>

              <div className="profile-info">
                <div className="profile-field">
                  <span className="profile-label">Full Name</span>
                  <span className="profile-value">{user.name}</span>
                </div>
                
                <div className="profile-field">
                  <span className="profile-label">Email Address</span>
                  <span className="profile-value text-muted">{user.email}</span>
                </div>

                <div className="profile-field">
                  <span className="profile-label">Account Role</span>
                  <span className="profile-value">
                    <span className="profile-badge">{user.role || 'Member'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
