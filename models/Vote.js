const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    voteId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    beginning: { type: Date, required: true },
    end: { type: Date, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'VoteType', required: true },
    city: {type: String, required: false},
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;