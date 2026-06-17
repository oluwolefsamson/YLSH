import { Router } from 'express'
import * as ctrl from '../controllers/opportunities.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

// Public
router.get('/', ctrl.listOpportunities)
router.get('/:id', ctrl.getOpportunityById)

// Participant
router.get('/applications/me', auth, ctrl.getMyApplications)
router.post('/:id/apply', auth, ctrl.applyForOpportunity)

// Admin
router.post('/', auth, rbac('admin', 'super-admin'), ctrl.createOpportunity)
router.put('/:id', auth, rbac('admin', 'super-admin'), ctrl.updateOpportunity)
router.delete('/:id', auth, rbac('admin', 'super-admin'), ctrl.deleteOpportunity)
router.get('/:id/applications', auth, rbac('admin', 'super-admin'), ctrl.getApplicationsForOpportunity)
router.patch('/applications/:id/status', auth, rbac('admin', 'super-admin'), ctrl.updateApplicationStatus)

export default router
