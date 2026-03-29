const Board = require('../models/Board');
const Project = require('../models/Project');

// @desc    Create a board in a project
// @route   POST /api/projects/:projectId/boards
// @access  Private
const createBoard = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to modify this project');
    }

    const board = await Board.create({ name, project: projectId });
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all boards for a project
// @route   GET /api/projects/:projectId/boards
// @access  Private
const getBoards = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (!project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }

    const boards = await Board.find({ project: projectId }).sort({ createdAt: 1 });
    res.status(200).json(boards);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404);
      throw new Error('Board not found');
    }

    const project = await Project.findById(board.project);
    if (!project || !project.members.some(m => m.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Optional: Delete all tasks associated with this board
    const Task = require('../models/Task');
    await Task.deleteMany({ board: board._id });

    await board.deleteOne();
    res.status(200).json({ message: 'Board removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBoard,
  getBoards,
  deleteBoard
};
