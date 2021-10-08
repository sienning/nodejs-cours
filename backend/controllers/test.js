const Post = require('../models/post')
const fs = require('fs')
const mongoose = require('mongoose')

exports.createPost = (req, res, next) => {
    const postObject = req.body

    delete postObject._id;
    const p = new Post({
        ...postObject
    })
    p.save()
        .then(() => res.status(201).json({ message: 'ok' }))
        .catch(error => res.status(400).json({ error }))
}

exports.updatePostId = (req, res, next) => {
    Post.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'ok' }))
        .catch(() => res.status(400).json({ error }))
}

exports.deletePostId = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'ok' }))
        .catch(err => console.log(err))

}

exports.getPostId = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }))
}

exports.getAllPost = (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}

exports.likeDislike = (req, res, next) => {
    let id = req.params.id;

    let likes = req.body.likes,
        dislikes = req.body.dislikes;
    const postId = mongoose.Types.ObjectId(id);

    Post.findByIdAndUpdate(postId, { "likes": likes, "dislikes": dislikes })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}