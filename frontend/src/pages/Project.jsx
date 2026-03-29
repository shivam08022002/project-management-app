import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, fetchProjectById, inviteToProject, updateProject } from '../redux/slices/projectSlice';
import {
  fetchBoards,
  fetchTasks,
  updateTaskData,
  createTask,
  deleteBoard,
} from '../redux/slices/taskSlice';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/task/KanbanBoard';
import TaskModal from '../components/task/TaskModal';
import { Plus, Filter, Trash2, UserPlus, Send, Edit2 } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';
import FilterModal from '../components/task/FilterModal';
import projectService from '../services/projectService';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import '../styles/Board.css';

const Project = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { projects, currentProject } = useSelector((state) => state.projects);
  const { boards, tasks } = useSelector((state) => state.tasks);

  const [activeBoardId, setActiveBoardId] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    dueDate: '',
    assignedTo: '',
  });

  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showInviteOverlay, setShowInviteOverlay] = useState(false);
  const [boardInviteEmail, setBoardInviteEmail] = useState('');
  const [filters, setFilters] = useState({
    priority: '',
    assignedTo: '',
    status: '',
    dueDate: '',
  });

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    type: null,
    target: null,
  });

  const [editModal, setEditModal] = useState({
    show: false,
    type: null,
    targetId: null,
    value: '',
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Load project data
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchProjectById(id));
    dispatch(fetchBoards(id))
      .unwrap()
      .then((fetchedBoards) => {
        if (fetchedBoards?.length > 0) setActiveBoardId(fetchedBoards[0]._id);
      });
      
    userService.getAllUsers()
      .then(setAllUsers)
      .catch((err) => console.error("Failed to fetch all users:", err));
  }, [dispatch, id]);

  // Handle Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue]);

  // Fetch tasks when board or filters change
  useEffect(() => {
    if (activeBoardId) {
      const params = { ...filters, boardId: activeBoardId };
      if (debouncedSearch) params.search = debouncedSearch;
      dispatch(fetchTasks({ projectId: id, params }));
    }
  }, [dispatch, id, activeBoardId, filters, debouncedSearch]);

  // Drag & Drop
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (result.source.droppableId === destination.droppableId) return;
    dispatch(
      updateTaskData({
        taskId: draggableId,
        data: { status: destination.droppableId },
      })
    );
  };

  const handleBoardDelete = async () => {
    if (!activeBoardId) return;
    setConfirmDelete({
      show: true,
      type: 'board',
      target: activeBoardId,
    });
  };

  const executeDelete = async () => {
    if (confirmDelete.type === 'board') {
      dispatch(deleteBoard(confirmDelete.target))
        .unwrap()
        .then(() => {
          toast.success('Board deleted');
          if (boards.length > 1) {
            const index = boards.findIndex((b) => b._id === confirmDelete.target);
            const nextBoard = boards[index === 0 ? 1 : index - 1];
            setActiveBoardId(nextBoard?._id);
          } else {
            setActiveBoardId(null);
          }
          setConfirmDelete({ show: false, type: null, target: null });
        })
        .catch(() => toast.error('Error deleting board'));
    } else if (confirmDelete.type === 'project') {
      const { deleteProject } = await import('../redux/slices/projectSlice');
      dispatch(deleteProject(confirmDelete.target))
        .unwrap()
        .then(() => {
          toast.success('Project deleted');
          navigate('/');
        })
        .catch(() => toast.error('Error deleting project'));
    } else if (confirmDelete.type === 'task') {
      const { deleteTask } = await import('../redux/slices/taskSlice');
      dispatch(deleteTask(confirmDelete.target))
        .unwrap()
        .then(() => {
          toast.info('Task deleted');
          setConfirmDelete({ show: false, type: null, target: null });
        })
        .catch(() => toast.error('Error deleting task'));
    }
  };

  const handleBoardInvite = (e) => {
    e.preventDefault();
    if (!boardInviteEmail.trim()) return;
    dispatch(inviteToProject({ id, email: boardInviteEmail }))
      .unwrap()
      .then(() => {
        toast.success('Invitation sent!');
        setBoardInviteEmail('');
        setShowInviteOverlay(false);
      })
      .catch((err) => toast.error(err));
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!editModal.value.trim()) return;
    try {
      if (editModal.type === 'project') {
        dispatch(updateProject({ id, data: { name: editModal.value } }))
          .unwrap()
          .then(() => {
            toast.success('Project renamed');
            setEditModal({ show: false, type: null, targetId: null, value: '' });
          });
      } else if (editModal.type === 'board') {
        await projectService.updateBoard(editModal.targetId, { name: editModal.value });
        toast.success('Board renamed');
        dispatch(fetchBoards(id));
        setEditModal({ show: false, type: null, targetId: null, value: '' });
      }
    } catch (err) {
      toast.error('Error renaming');
    }
  };

  const handleProjectDelete = () => {
    setConfirmDelete({ show: true, type: 'project', target: id });
  };

  const handleBoardCreate = async (boardName) => {
    try {
      const res = await projectService.createBoard(id, { name: boardName });
      if (!activeBoardId) setActiveBoardId(res._id);
      dispatch(fetchBoards(id));
      toast.success('Board created!');
    } catch {
      toast.error('Error creating board');
    }
  };

  // Task save
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title) return;

    const payload = { ...taskForm };
    if (!payload.assignedTo) delete payload.assignedTo;
    if (!payload.dueDate) delete payload.dueDate;

    if (editingTask) {
      dispatch(updateTaskData({ taskId: editingTask._id, data: payload }))
        .unwrap()
        .then(() => {
          setShowTaskModal(false);
          setEditingTask(null);
          toast.success('Task Updated');
        });
    } else {
      dispatch(createTask({ boardId: activeBoardId, taskData: payload }))
        .unwrap()
        .then(() => {
          setShowTaskModal(false);
          toast.success('Task Created');
        });
    }
  };

  // Open task modal
  const openTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        dueDate: '',
        assignedTo: '',
      });
    }
    setShowTaskModal(true);
  };

  const clearFilters = () => {
    setFilters({ priority: '', assignedTo: '', status: '', dueDate: '' });
    setSearchValue('');
  };

  const activeBoard = boards.find((b) => b._id === activeBoardId);

  return (
    <div className="app-layout">
      <Sidebar
        projects={projects}
        currentProjectId={id}
        currentProject={currentProject}
        boards={boards}
        activeBoardId={activeBoardId}
        onBoardSelect={setActiveBoardId}
        onBoardCreate={handleBoardCreate}
        allUsers={allUsers}
      />

      <div className="app-main">
        <Header searchValue={searchValue} onSearchChange={setSearchValue} />

        <div className="app-content">
          {/* Board Header */}
          <div className="board-header">
            <div className="flex items-center gap-md">
              <h1 className="board-title">
                {activeBoard?.name || currentProject?.name || 'Loading...'}
              </h1>
            </div>

            {activeBoardId && (
              <div className="board-actions">
                <button
                  className="board-delete-btn"
                  onClick={() => setConfirmDelete({ show: true, type: 'board', target: activeBoardId })}
                  title="Delete Board"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  className="btn-icon-bg"
                  onClick={() => setEditModal({ show: true, type: 'board', targetId: activeBoardId, value: activeBoard?.name || '' })}
                  title="Edit Board Name"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="board-filter-btn"
                  onClick={() => setShowFilterModal(true)}
                >
                  <Filter size={15} />
                  Filter
                </button>
                <button
                  className="board-add-task-btn"
                  onClick={() => openTaskModal()}
                >
                  <Plus size={15} />
                  Add Task
                </button>
                <div className="board-invite-wrapper" style={{ position: 'relative' }}>
                  <button 
                    className="board-invite-btn" 
                    onClick={() => setShowInviteOverlay(!showInviteOverlay)}
                  >
                    <UserPlus size={15} />
                    Invite
                  </button>
                  {showInviteOverlay && (
                    <div className="board-invite-overlay fade-in">
                      <select
                        value={boardInviteEmail}
                        onChange={(e) => setBoardInviteEmail(e.target.value)}
                        className="board-invite-select"
                      >
                        <option value="">Invite user...</option>
                        {allUsers.filter(u => !currentProject?.members?.some(m => (m._id || m) === u._id)).map(u => (
                          <option key={u._id} value={u.email}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <button className="btn btn-primary btn-sm" onClick={handleBoardInvite} disabled={!boardInviteEmail}>
                        <Send size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Board Tabs */}
          {boards.length > 1 && (
            <div className="flex gap-sm board-tabs">
              {boards.map((b) => (
                <button
                  key={b._id}
                  className={`btn ${activeBoardId === b._id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveBoardId(b._id)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}

          {/* Removed inline Filter Bar */}

          {/* Empty States */}
          {!activeBoardId && boards.length > 0 && (
            <p className="text-muted">Select a board to view tasks.</p>
          )}
          {!activeBoardId && boards.length === 0 && (
            <p className="text-muted">
              Create a board from the sidebar to start adding tasks.
            </p>
          )}

          {/* Kanban Board */}
          {activeBoardId && (
            <KanbanBoard
              tasks={tasks}
              onDragEnd={onDragEnd}
              onTaskClick={openTaskModal}
              onTaskDelete={(taskId) => setConfirmDelete({ show: true, type: 'task', target: taskId })}
            />
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        show={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleSaveTask}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        editingTask={editingTask}
        members={allUsers}
      />

      {/* Confirmation Modal */}
      {/* Confirmation Modal */}
      <ConfirmModal
        show={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, type: null, target: null })}
        onConfirm={executeDelete}
        title={`Delete ${confirmDelete.type ? confirmDelete.type.charAt(0).toUpperCase() + confirmDelete.type.slice(1) : ''}`}
        message={`Are you sure you want to delete this ${confirmDelete.type}? This action cannot be undone.`}
        confirmText="Delete Permanently"
      />

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        allUsers={allUsers}
        onClear={clearFilters}
      />
      {/* Edit Modal (Generic for Project/Board Rename) */}
      {editModal.show && (
        <div className="modal-overlay" onClick={() => setEditModal({ ...editModal, show: false })}>
          <div className="modal-panel confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Rename {editModal.type === 'project' ? 'Project' : 'Board'}</h2>
            </div>
            <form onSubmit={handleRename}>
              <div className="modal-body">
                <input
                  type="text"
                  className="board-invite-select"
                  value={editModal.value}
                  onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditModal({ ...editModal, show: false })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
