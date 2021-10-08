const express = require('express')
const router = express.Router()
const commentsController = require('./../controllers/comments')
const auth = require('../middleware/auth')

router.post('/', auth, commentsController.createComment)
router.get('/:idpost', auth, commentsController.getComments)
router.delete('/delete/:id', auth, commentsController.deleteCommentId)

module.exports = router