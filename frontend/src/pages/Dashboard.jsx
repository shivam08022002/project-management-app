import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  deleteProject,
  updateProject,
} from '../redux/slices/projectSlice';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Link } from 'react-router-dom';
import { Trash2, Edit2, UserPlus, X } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects, isLoading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    targetId: null,
  });

  const handleEditClick = (e, proj) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingProject(proj);
    setEditName(proj.name);
    setEditDesc(proj.description || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return toast.error('Project name is required');
    dispatch(updateProject({ id: editingProject._id, data: { name: editName, description: editDesc } }))
      .unwrap()
      .then(() => {
        toast.success('Project updated successfully');
        setEditingProject(null);
      })
      .catch((err) => toast.error(typeof err === 'string' ? err : 'Error updating project'));
  };

  const handleDeleteProject = () => {
    dispatch(deleteProject(confirmDelete.targetId))
      .unwrap()
      .then(() => {
        toast.info('Project Deleted');
        setConfirmDelete({ show: false, targetId: null });
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="app-layout">
      <Sidebar projects={projects} />
      <div className="app-main">
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-welcome">
              <h1>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
              <p>Here are your current active projects.</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted">Loading projects...</p>
          ) : (
            <div className="dashboard-grid">
              {projects.map((proj) => {
                const isOwner =
                  proj.owner?._id === user?._id ||
                  proj.owner === user?._id;

                return (
                  <div key={proj._id} className="project-card">
                    <Link
                      to={`/project/${proj._id}`}
                      className="project-card-link"
                    >
                      <h3>{proj.name}</h3>
                      <p>{proj.description || 'No description provided.'}</p>
                    </Link>

                    <div className="project-card-footer">
                      <span>{proj.members?.length} Members</span>
                      {isOwner && (
                        <div className="project-card-actions">
                          <button
                            className="project-card-action-btn"
                            onClick={(e) => handleEditClick(e, proj)}
                            title="Edit Project"
                          >
                            <Edit2 size={15} color="var(--accent-cyan)" />
                          </button>
                          <button
                            className="project-card-action-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setConfirmDelete({ show: true, targetId: proj._id });
                            }}
                            title="Delete Project"
                          >
                            <Trash2 size={15} color="var(--accent-red)" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <p className="dashboard-empty">
                  No projects found. Create one to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {editingProject && (
        <div className="modal-overlay" onClick={() => setEditingProject(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Project</h2>
              <button className="modal-close" onClick={() => setEditingProject(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  placeholder="Optional project description..."
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProject(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Delete Confirmation */}
      <ConfirmModal
        show={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, targetId: null })}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated boards and tasks will be permanently removed. This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default Dashboard;
