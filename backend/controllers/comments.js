const Comments = require('../models/comments');
const mongoose = require('mongoose');

exports.createComment = (req, res, next) => {
    const titre = req.body.titre,
        text = req.body.text,
        idPost = mongoose.Types.ObjectId(req.body.idPost),
        email = req.body.email;

    const p = new Comments({
        titre: titre,
        text: text,
        idPost: idPost,
        author: email,
    })

    p.save()
        .then(() => res.status(201).json({ message: 'ok' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteCommentId = (req, res, next) => {
    Comments.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'ok' }))
        .catch(err => console.log(err))
}

exports.getComments = (req, res, next) => {
    Comments.find({ idPost: req.params.idpost })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }))
}
