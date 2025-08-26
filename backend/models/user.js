const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    journalList: {
        type: mongoose.Schema.Types.ObjectId,
    }
})

const User = mongoose.model('user', user)
module.exports = User