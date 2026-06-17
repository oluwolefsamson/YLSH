import { Router } from 'express'
import * as ctrl from '../controllers/registrations.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/me', auth, ctrl.myRegistrations)
router.get('/event/:eventId', auth, rbac('admin', 'super-admin'), ctrl.byEvent)
router.post('/checkin', auth, rbac('admin', 'super-admin'), ctrl.checkIn)

export default router
