import React from 'react';
import { X } from 'lucide-react';
import '../../styles/Modal.css';

const FilterModal = ({ show, onClose, filters, setFilters, allUsers, onClear }) => {
  if (!show) return null;

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Filter Tasks</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-form">
          <div className="modal-form-grid">
            <div className="form-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <select
                value={filters.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
              >
                <option value="">All Assignees</option>
                {allUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date (On or Before)</label>
              <input
                type="date"
                value={filters.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClear}>
              Clear All
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
