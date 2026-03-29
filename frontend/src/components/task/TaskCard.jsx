import { Calendar, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../redux/slices/taskSlice';
import { toast } from 'react-toastify';

const TaskCard = ({ task, provided, snapshot, onClick, onTaskDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onTaskDelete?.(task._id);
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      className="task-card"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}
      onClick={onClick}
    >
      <div className="task-card-header">
        <span className="task-card-title">{task.title}</span>
        <div className="task-card-header-right">
          <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority.toUpperCase()}</span>
          <button className="task-delete-btn" onClick={handleDelete} title="Delete Task">
             <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="task-card-desc">
          {task.description}
        </div>
      )}
      {task.dueDate && (
        <div className={`task-card-due ${isOverdue ? 'overdue' : ''}`}>
          <Calendar size={12} />
          {new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
