import { Router } from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/auth.controller'
import validate from '../middleware/validate'
import authMiddleware from '../middleware/auth'

const router = Router()

router.post(
  '/verify-nin',
  [body('nin').trim().notEmpty().withMessage('NIN is required')],
  validate,
  authController.verifyNIN
)

router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('nin').trim().notEmpty().withMessage('NIN is required'),
  ],
  validate,
  authController.register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
)

router.post('/logout', authController.logout)
router.get('/me', authMiddleware, authController.me)

export default router
