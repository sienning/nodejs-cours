const mongoose = require('mongoose')
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();
let date = cDay + "/" + cMonth + "/" + cYear;
const commentsSchema = mongoose.Schema({
    titre: { type: String, required: true },
    text: { type: String, required: true },
    idPost: { type: mongoose.Types.ObjectId, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: date }
})

module.exports = mongoose.model('Comments', commentsSchema)