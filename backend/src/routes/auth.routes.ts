import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/auth.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { handleValidation } from '../middleware/validate';

const router = Router();

router.post('/register', registerValidator, handleValidation, register);
router.post('/login', loginValidator, handleValidation, login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

export default router;
