const mongoose = require('mongoose')

const journal = new mongoose.Schema({
    title: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    journalNote: {
        type: String,
        required: true
    },
    analysis: { type: String },  
    analyzed: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
journal.index({ user: 1, date: 1 }, { unique: true });
const Journal = mongoose.model('journal', journal);
module.exports = Journal