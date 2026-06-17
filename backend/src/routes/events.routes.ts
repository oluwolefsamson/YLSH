import { Router } from 'express'
import * as ctrl from '../controllers/events.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)

router.post('/', auth, rbac('admin', 'super-admin'), ctrl.create)
router.put('/:id', auth, rbac('admin', 'super-admin'), ctrl.update)
router.delete('/:id', auth, rbac('admin', 'super-admin'), ctrl.remove)

router.post('/:id/register', auth, ctrl.registerForEvent)
router.delete('/:id/register', auth, ctrl.cancelRegistration)

export default router
