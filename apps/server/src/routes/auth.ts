import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import { signUp, signIn, signOut } from '../controllers/auth.controller';

const router = Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  signUp
);

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  signIn
);

router.post('/signout', signOut);

export default router; 