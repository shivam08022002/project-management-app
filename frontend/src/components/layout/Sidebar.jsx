import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { createProject, inviteToProject } from '../../redux/slices/projectSlice';
import { Plus, LogOut, Send, LayoutDashboard, Layers } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../styles/Sidebar.css';

const AVATAR_COLORS = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#00bcd4', '#4caf50', '#ff9800', '#ff5722'];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Sidebar = ({
  projects = [],
  currentProjectId = null,
  currentProject = null,
  boards = [],
  activeBoardId = null,
  onBoardSelect,
  onBoardCreate,
  onProjectSelect,
  allUsers = [],
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const [showBoardInput, setShowBoardInput] = useState(false);
  const [boardName, setBoardName] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return toast.error('Project name is required');
    dispatch(createProject({ name: newProjectName, description: newProjectDesc }))
      .unwrap()
      .then((proj) => {
        toast.success('Project Created!');
        setNewProjectName('');
        setNewProjectDesc('');
        setShowCreateProject(false);
        navigate(`/project/${proj._id}`);
      })
      .catch((err) => toast.error(err));
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    onBoardCreate?.(boardName);
    setBoardName('');
    setShowBoardInput(false);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !currentProjectId) return;
    dispatch(inviteToProject({ id: currentProjectId, email: inviteEmail }))
      .unwrap()
      .then(() => {
        toast.success('Invitation sent to user!');
        setInviteEmail('');
        setTimeout(() => window.location.reload(), 800);
      })
      .catch((err) => toast.error(typeof err === 'string' ? err : 'Error sending invitation'));
  };

  const isProjectView = location.pathname.startsWith('/project/');
  const members = currentProject?.members || [];
  const owner = currentProject?.owner;

  // Filter out users who are already members
  const availableUsersToInvite = allUsers.filter(
    (u) => !members.some((m) => (m._id || m) === u._id)
  );

  return (
    <div className="sidebar">
      {/* Brand / Logo */}
      <div className="sidebar-brand">
        <Link to="/" className="sidebar-brand-link">
          <div className="sidebar-brand-icon">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-pro">PRO</span>
            <span className="brand-xima">XIMA</span>
          </div>
        </Link>
      </div>

      {/* Global Navigation */}
      <div className="sidebar-global-nav">
        <Link 
          to="/" 
          className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
      </div>

      {/* Removed Redundant Project Selector */}

      {/* Projects Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Projects</div>
        <ul className="sidebar-project-list">
          {projects.map((p) => (
            <li key={p._id}>
              <Link
                to={`/project/${p._id}`}
                className={`sidebar-project-item ${currentProjectId === p._id ? 'active' : ''}`}
              >
                <span>{p.name}</span>
                {currentProjectId === p._id && (
                  <span className="sidebar-project-badge">Active</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Create Project */}
        {!showCreateProject ? (
          <button
            className="sidebar-create-btn"
            onClick={() => setShowCreateProject(true)}
          >
            <Plus size={14} />
            Create New Project
          </button>
        ) : (
          <form onSubmit={handleCreateProject} className="sidebar-board-input">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
            />
            <div className="sidebar-board-input-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                Create
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCreateProject(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* New Board (only in project view) */}
        {isProjectView && (
          <>
            {!showBoardInput ? (
              <button
                className="sidebar-board-btn"
                onClick={() => setShowBoardInput(true)}
              >
                <Plus size={14} />
                New Board
              </button>
            ) : (
              <form onSubmit={handleCreateBoard} className="sidebar-board-input">
                <input
                  type="text"
                  placeholder="Board name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  autoFocus
                />
                <div className="sidebar-board-input-actions">
                  <button type="submit" className="btn btn-primary btn-sm">
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowBoardInput(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Team Section (only in project view) */}
      {isProjectView && members.length > 0 && (
        <div className="sidebar-team">
          <div className="sidebar-team-header">
            <span className="sidebar-team-title">Team</span>
            <span className="sidebar-team-count">{members.length}</span>
          </div>
          <div className="sidebar-team-list">
            {members.map((m) => {
              const memberId = m._id || m;
              const memberName = m.name || 'Unknown';
              const initial = memberName.charAt(0).toUpperCase();
              const isOwner =
                (owner?._id || owner) === memberId;
              return (
                <div key={memberId} className="sidebar-team-member">
                  <div
                    className="avatar avatar-sm"
                    style={{ background: getAvatarColor(memberName) }}
                  >
                    {initial}
                  </div>
                  <div className="sidebar-team-member-info">
                    <span className="sidebar-team-member-name">{memberName}</span>
                    <span className="sidebar-team-member-role">
                      {isOwner ? 'Admin' : 'Member'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add User */}
          <form className="sidebar-add-user" onSubmit={handleInvite}>
            <select
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', fontSize: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
            >
              <option value="" disabled>Invite User...</option>
              {availableUsersToInvite.map(u => (
                <option key={u._id} value={u.email}>{u.name} ({u.email})</option>
              ))}
            </select>
            <div className="sidebar-add-user-actions">
              <button type="submit" className="btn-send" disabled={!inviteEmail || availableUsersToInvite.length === 0}>
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logout */}
      <div className="sidebar-logout">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
