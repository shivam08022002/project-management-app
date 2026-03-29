const Task = require('../models/Task');
const Board = require('../models/Board');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/boards/:boardId/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404);
      throw new Error('Board not found');
    }

    const project = await Project.findById(board.project);
    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to add task to this board');
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      priority,
      dueDate,
      assignedTo,
      board: boardId,
      project: project._id,
      activityHistory: [{ action: 'Task created', user: req.user._id }]
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a board (or project) w/ filtering and search
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, assignedTo, priority, search, dueDate, boardId, page = 1, limit = 10 } = req.query;

    const project = await Project.findById(projectId);
    if (!project || !project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized');
    }

    const query = { project: projectId };

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };
    if (boardId) query.board = boardId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status, assignee, etc (Support Drag and Drop)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const project = await Project.findById(task.project);
    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const { title, description, status, priority, dueDate, assignedTo, board } = req.body;

    if (status && status !== task.status) {
      task.activityHistory.push({ action: `Status changed from ${task.status} to ${status}`, user: req.user._id });
    }

    if (assignedTo && assignedTo !== task.assignedTo?.toString()) {
      task.activityHistory.push({ action: `Assigned user updated`, user: req.user._id });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.board = board || task.board;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const project = await Project.findById(task.project);
    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
