import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getTasks);
router.get('/stats/overview', getTaskStats);
router.get('/:id', getTask);
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').isIn(['pending', 'in-progress', 'completed']).optional(),
  body('priority').isIn(['low', 'medium', 'high']).optional()
], createTask);
router.put('/:id', [
  body('title').notEmpty().withMessage('Title is required').optional(),
  body('status').isIn(['pending', 'in-progress', 'completed']).optional(),
  body('priority').isIn(['low', 'medium', 'high']).optional()
], updateTask);
router.delete('/:id', deleteTask);

export default router;