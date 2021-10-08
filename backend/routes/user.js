const express = require('express')
const router = express.Router()
const userController = require('./../controllers/user')
const auth = require('../middleware/auth')

router.post('/see-user', auth, userController.seeUser)
router.post('/update', auth, userController.updateUser)
router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/like-dislike', userController.likeDislike)

module.exports = router
