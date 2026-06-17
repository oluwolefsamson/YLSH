import { Router } from 'express'
import * as ctrl from '../controllers/volunteers.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/me', auth, ctrl.myVolunteerRoles)
router.post('/', auth, ctrl.apply)
router.get('/event/:eventId', auth, rbac('admin', 'super-admin'), ctrl.byEvent)
router.patch('/:id/status', auth, rbac('admin', 'super-admin'), ctrl.updateStatus)

export default router
