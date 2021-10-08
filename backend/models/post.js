const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    titre: { type: String, required: true },
    text: { type: String, required: true },
    autor: { type: String, required: true },
    urlImage: { type: String, required: false },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
})

module.exports = mongoose.model('Post', postSchema)