import { Router } from 'express'
import * as ctrl from '../controllers/speakers.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/', ctrl.list)
router.post('/', auth, rbac('admin', 'super-admin'), ctrl.create)
router.put('/:id', auth, rbac('admin', 'super-admin'), ctrl.update)
router.delete('/:id', auth, rbac('admin', 'super-admin'), ctrl.remove)

export default router
