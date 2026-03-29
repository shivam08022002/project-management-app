import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Bell, Check, X } from 'lucide-react';
import userService from '../../services/userService';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { toast } from 'react-toastify';
import '../../styles/Header.css';

const AVATAR_COLORS = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#00bcd4', '#4caf50', '#ff9800', '#ff5722'];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Header = ({ searchValue, onSearchChange }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await userService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRespond = async (id, action) => {
    try {
      await userService.respondToInvitation(id, action);
      toast.success(`Invitation ${action}ed`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (action === 'accept') {
        dispatch(fetchProjects());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} invitation`);
    }
  };

  return (
    <div className="header">
      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchValue || ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="header-right">
        <div className="header-notification" ref={dropdownRef}>
          <div onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer', display: 'flex' }}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="header-notification-badge">{notifications.length}</span>
            )}
          </div>
          
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className="notification-item">
                      <div className="notification-content">
                        <strong>{notif.inviter?.name}</strong> invited you to <strong>{notif.project?.name}</strong>
                      </div>
                      <div className="notification-actions">
                        <button className="btn-accept" onClick={() => handleRespond(notif._id, 'accept')}>
                          <Check size={14} /> Accept
                        </button>
                        <button className="btn-decline" onClick={() => handleRespond(notif._id, 'decline')}>
                          <X size={14} /> Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link to="/profile" className="header-user" style={{ textDecoration: 'none' }}>
          <div
            className="avatar"
            style={{ background: getAvatarColor(user?.name) }}
          >
            {initial}
          </div>
          <span className="header-user-name">{user?.name || 'User'}</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
