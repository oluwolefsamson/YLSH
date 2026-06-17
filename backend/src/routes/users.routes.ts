import { Router } from 'express'
import * as ctrl from '../controllers/users.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

// Self
router.get('/me', auth, ctrl.getMe)
router.put('/me', auth, ctrl.updateMe)

// Mentor approval (admin/super-admin)
router.get('/mentors/pending', auth, rbac('admin', 'super-admin'), ctrl.listPendingMentors)
router.patch('/:id/approve', auth, rbac('admin', 'super-admin'), ctrl.approveMentor)
router.patch('/:id/decline', auth, rbac('admin', 'super-admin'), ctrl.declineMentor)

// Admin creation (super-admin only)
router.post('/admin', auth, rbac('super-admin'), ctrl.createAdmin)

// General user management (admin/super-admin)
router.get('/', auth, rbac('admin', 'super-admin'), ctrl.list)
router.get('/:id', auth, rbac('admin', 'super-admin'), ctrl.getById)
router.patch('/:id/status', auth, rbac('admin', 'super-admin'), ctrl.updateStatus)
router.patch('/:id/role', auth, rbac('super-admin'), ctrl.updateRole)
router.delete('/:id', auth, rbac('admin', 'super-admin'), ctrl.remove)

export default router
