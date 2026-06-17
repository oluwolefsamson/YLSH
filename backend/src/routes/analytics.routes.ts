import { Router } from 'express'
import * as ctrl from '../controllers/analytics.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/dashboard', auth, rbac('admin', 'super-admin'), ctrl.dashboard)
router.get('/growth', auth, rbac('admin', 'super-admin'), ctrl.userGrowth)
router.get('/events', auth, rbac('admin', 'super-admin'), ctrl.eventStats)
router.get('/audit-log', auth, rbac('admin', 'super-admin'), ctrl.auditLog)

export default router
