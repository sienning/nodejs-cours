const express = require('express')
require('dotenv').config()
const app = express()
//const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Post = require('./models/post')
const port = 3000
const testRoutes = require('./routes/test')
const userRoutes = require('./routes/user')
const commentsRoutes = require('./routes/comments')
const path = require('path')
mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.qehei.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("db valid"))
    .catch(() => console.log("db error"))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content,Accept,Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    next()
})

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/test', testRoutes)
app.use('/user', userRoutes)
app.use('/comments', commentsRoutes)


module.exports = app