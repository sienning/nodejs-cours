const bcrypt = require('bcryptjs')
const User = require('./../models/user')
const jsontoken = require('jsonwebtoken')
const mongoose = require('mongoose')

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                age: req.body.age,
                description: req.body.description
            })
            user.save()
                .then(() => res.status(201).json({ message: 'create user' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'pas trouvé' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(ok => {
                    if (!ok) {
                        return res.status((401).json({ error: 'incorect mdp' }))
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsontoken.sign(
                            { userId: user._id }, 'cryptage', { expiresIn: '48h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
}

exports.seeUser = (req, res, next) => {
    const email = req.body.email
    User.findOne({ email: email })
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => res.status(500).json({ error }))
}

exports.updateUser = (req, res, next) => {
    const id = req.body.id;
    const email = req.body.email,
        lastname = req.body.lastname,
        firstname = req.body.firstname,
        age = req.body.age,
        description = req.body.description;
    const userId = mongoose.Types.ObjectId(id);
    User.findByIdAndUpdate(userId, { "email": email, "lastname": lastname, "firstname": firstname, "age": age, "description": description })
        .then(user => { res.sendStatus(201) })
        .catch(error => res.status(500).json({ error }))
}

exports.likeDislike = (req, res, next) => {
    const id = req.body.id;
    const likes = req.body.likes;
    const dislikes = req.body.dislikes;
    const userId = mongoose.Types.ObjectId(id);

    User.findByIdAndUpdate(userId, { "likedPosts": likes, "dislikedPosts": dislikes })
        .then(user => { res.sendStatus(201) })
        .catch(error => res.status(500).json({ error }))
}