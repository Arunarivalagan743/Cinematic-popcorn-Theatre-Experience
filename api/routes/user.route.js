


import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  getUserWithBookings,
  debugUsers,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.get('/debug', debugUsers);
router.get('/:id', verifyToken, getUserWithBookings);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;