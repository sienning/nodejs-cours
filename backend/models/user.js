const mongoose = require('mongoose')
const uniValid = require('mongoose-unique-validator')

const userModel = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstname: { type: String },
    lastname: { type: String },
    age: { type: Number },
    description: { type: String },
    likedPosts: {type: Array},
    dislikedPosts: {type: Array},
})

userModel.plugin(uniValid)

module.exports = mongoose.model('User', userModel)