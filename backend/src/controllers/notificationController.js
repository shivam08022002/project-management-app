const Invitation = require('../models/Invitation');
const Project = require('../models/Project');

// @desc    Get user's pending notifications/invitations
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const invitations = await Invitation.find({
      invitee: req.user._id,
      status: 'pending'
    })
      .populate('project', 'name')
      .populate('inviter', 'name email');

    res.status(200).json(invitations);
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to an invitation (accept/decline)
// @route   POST /api/users/notifications/:id/respond
// @access  Private
const respondToInvitation = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'decline'
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      res.status(404);
      throw new Error('Invitation not found');
    }

    if (invitation.invitee.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to respond to this invitation');
    }

    if (invitation.status !== 'pending') {
      res.status(400);
      throw new Error(`Invitation is already ${invitation.status}`);
    }

    if (action === 'accept') {
      invitation.status = 'accepted';
      const project = await Project.findById(invitation.project);
      
      if (project && !project.members.includes(req.user._id)) {
        project.members.push(req.user._id);
        await project.save();
      }
    } else if (action === 'decline') {
      invitation.status = 'declined';
    } else {
      res.status(400);
      throw new Error('Invalid action');
    }

    await invitation.save();

    res.status(200).json({ message: `Invitation ${action}ed successfully`, invitation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  respondToInvitation,
};
