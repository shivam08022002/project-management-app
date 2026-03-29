const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBoard, getBoards, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createBoard)
  .get(getBoards);

router.route('/:id')
  .delete(deleteBoard);

module.exports = router;
