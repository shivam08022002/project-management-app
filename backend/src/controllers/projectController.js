const Project = require('../models/Project');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ members: req.user._id })
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limit);
      
    const total = await Project.countDocuments({ members: req.user._id });

    res.status(200).json({
      projects,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (!project.members.some(member => member._id.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the project owner can update this project');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the project owner can delete this project');
    }

    await project.deleteOne();
    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite user to project
// @route   POST /api/projects/:id/invite
// @access  Private
const inviteToProject = async (req, res, next) => {
    try {
        const { email } = req.body;
        const User = require('../models/User');
        const Invitation = require('../models/Invitation');
        const project = await Project.findById(req.params.id);

        if (!project) {
          res.status(404);
          throw new Error('Project not found');
        }

        if (project.owner.toString() !== req.user._id.toString()) {
          res.status(403);
          throw new Error('Only project owner can invite');
        }

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            res.status(404);
            throw new Error('User not found with this email');
        }

        if (project.members.includes(userToInvite._id)) {
            res.status(400);
            throw new Error('User is already a member');
        }

        // Check for existing pending invitation
        const existingInvite = await Invitation.findOne({
            project: project._id,
            invitee: userToInvite._id,
            status: 'pending'
        });

        if (existingInvite) {
            res.status(400);
            throw new Error('An invitation is already pending for this user');
        }

        const invitation = await Invitation.create({
            project: project._id,
            inviter: req.user._id,
            invitee: userToInvite._id,
            status: 'pending'
        });

        res.status(200).json({ message: 'Invitation sent successfully', invitation });
    } catch(err) {
        next(err);
    }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  inviteToProject
};
