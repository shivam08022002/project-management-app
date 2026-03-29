import { X } from 'lucide-react';
import '../../styles/Modal.css';

const TaskModal = ({
  show,
  onClose,
  onSubmit,
  taskForm,
  setTaskForm,
  editingTask,
  members,
}) => {
  if (!show) return null;

  const handleChange = (field, value) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel modal-panel-lg">
        <div className="modal-header">
          <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="modal-form-grid">
            <div className="form-group form-group-full">
              <label>Task Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="form-group form-group-full">
              <label>Description</label>
              <textarea
                rows="3"
                value={taskForm.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add a description..."
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
              >
                <option value="">Unassigned</option>
                {members?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          {/* Read-Only Timestamps */}
          {editingTask && (
            <div className="modal-form-grid" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Created At</label>
                <input
                  type="text"
                  value={new Date(editingTask.createdAt).toLocaleString()}
                  disabled
                  className="input-readonly"
                />
              </div>
              <div className="form-group">
                <label>Last Updated</label>
                <input
                  type="text"
                  value={new Date(editingTask.updatedAt).toLocaleString()}
                  disabled
                  className="input-readonly"
                />
              </div>
            </div>
          )}

          {/* Activity History */}
          {editingTask && editingTask.activityHistory?.length > 0 && (
            <div className="activity-section">
              <label>Activity History</label>
              <ul className="activity-list">
                {editingTask.activityHistory
                  .slice()
                  .reverse()
                  .map((act, i) => (
                    <li key={i} className="activity-item">
                      <span className="activity-item-dot">•</span>
                      {act.action}
                      <span className="activity-item-date">
                        {new Date(act.date).toLocaleString()}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
