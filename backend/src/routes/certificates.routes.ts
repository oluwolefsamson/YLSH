import { Router } from 'express'
import * as ctrl from '../controllers/certificates.controller'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = Router()

router.get('/me', auth, ctrl.myCertificates)
router.get('/verify/:code', ctrl.verifyByCode)

router.get('/', auth, rbac('admin', 'super-admin'), ctrl.listAll)
router.post('/generate/:registrationId', auth, rbac('admin', 'super-admin'), ctrl.generate)
router.post('/batch/:eventId', auth, rbac('admin', 'super-admin'), ctrl.batchGenerate)

export default router
