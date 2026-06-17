import { Router } from 'express'
import * as ctrl from '../controllers/learning.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

// Public/authenticated list (progress merged if authed)
router.get('/', ctrl.listResources)
router.get('/:id', ctrl.getResourceById)

// User progress
router.post('/:id/progress', auth, ctrl.updateProgress)

// Admin management
router.post('/', auth, rbac('admin', 'super-admin'), ctrl.createResource)
router.put('/:id', auth, rbac('admin', 'super-admin'), ctrl.updateResource)
router.delete('/:id', auth, rbac('admin', 'super-admin'), ctrl.deleteResource)

export default router
