const router = require('express').Router()
const usersController = require('../controllers/users.controller')
const auth = require('../middleware/auth')

router.use(auth)

router.get('/', usersController.list)
router.get('/:id', usersController.getById)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.remove)

module.exports = router
