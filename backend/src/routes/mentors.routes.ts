import { Router } from 'express'
import * as ctrl from '../controllers/mentors.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

// Public
router.get('/', ctrl.listMentors)
router.get('/:id', ctrl.getMentorById)

// Mentor self-management
router.get('/me/profile', auth, rbac('mentor'), ctrl.getMyMentorProfile)
router.put('/me/profile', auth, rbac('mentor'), ctrl.updateMyMentorProfile)
router.put('/me/availability', auth, rbac('mentor'), ctrl.updateAvailability)
router.get('/me/mentees', auth, rbac('mentor'), ctrl.getMyMentees)
router.get('/me/stats', auth, rbac('mentor'), ctrl.getMentorStats)

// Participant requests a session
router.post('/:id/request', auth, ctrl.requestSession)

export default router
