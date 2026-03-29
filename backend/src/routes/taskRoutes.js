const express = require('express');
const router = express.Router(); // no mergeParams needed if mounted specifically
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/boards/:boardId/tasks', createTask);
router.get('/projects/:projectId/tasks', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
