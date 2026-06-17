import { Router } from 'express'
import * as ctrl from '../controllers/sessions.controller'
import auth from '../middleware/auth'

const router = Router()

router.get('/me', auth, ctrl.getMySessions)
router.get('/:id', auth, ctrl.getSessionById)
router.patch('/:id/status', auth, ctrl.updateSessionStatus)
router.patch('/:id/outcome', auth, ctrl.addOutcome)
router.post('/:id/rate', auth, ctrl.rateSession)
router.delete('/:id', auth, ctrl.cancelSession)

export default router
