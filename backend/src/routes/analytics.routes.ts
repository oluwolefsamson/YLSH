import { Router } from 'express'
import * as ctrl from '../controllers/analytics.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/dashboard', auth, rbac('admin', 'super-admin'), ctrl.dashboard)
router.get('/growth', auth, rbac('admin', 'super-admin'), ctrl.userGrowth)
router.get('/events', auth, rbac('admin', 'super-admin'), ctrl.eventStats)
router.get('/audit-log', auth, rbac('admin', 'super-admin'), ctrl.auditLog)
router.get('/role-distribution', auth, rbac('super-admin'), ctrl.roleDistribution)
router.get('/top-states', auth, rbac('super-admin'), ctrl.topStates)
router.get('/super-dashboard', auth, rbac('super-admin'), ctrl.superDashboard)
router.get('/admins', auth, rbac('super-admin'), ctrl.listAdmins)

export default router
