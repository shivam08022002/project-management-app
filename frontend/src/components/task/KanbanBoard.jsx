import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';
import '../../styles/Board.css';

const KANBAN_COLUMNS = ['Todo', 'In Progress', 'Done'];

const COLUMN_DOTS = {
  Todo: 'todo',
  'In Progress': 'inprogress',
  Done: 'done',
};

const COLUMN_ICONS = {
  Todo: <Circle size={14} color="var(--accent-red)" />,
  'In Progress': <Clock size={14} color="var(--accent-cyan)" />,
  Done: <CheckCircle2 size={14} color="#4caf50" />,
};

const KanbanBoard = ({ tasks, onDragEnd, onTaskClick, onTaskDelete }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container">
        {KANBAN_COLUMNS.map((statusCol) => {
          const columnTasks = tasks.filter((t) => t.status === statusCol);
          return (
            <div key={statusCol} className="kanban-column">
              <div className="kanban-column-header">
                <div className="kanban-column-left">
                  {COLUMN_ICONS[statusCol]}
                  <span className="kanban-column-title">{statusCol}</span>
                </div>
                <div className="kanban-column-count">
                  {columnTasks.length}
                </div>
              </div>

              <Droppable droppableId={statusCol}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-dropzone ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columnTasks.length > 0 ? (
                      columnTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TaskCard
                              task={task}
                              provided={provided}
                              snapshot={snapshot}
                              onClick={() => onTaskClick(task)}
                              onTaskDelete={onTaskDelete}
                            />
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="kanban-empty-state">
                        <p>No tasks yet</p>
                        <button 
                          className="btn-add-inline"
                          onClick={() => onTaskClick(null)}
                        >
                          + ADD FIRST TASK
                        </button>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
