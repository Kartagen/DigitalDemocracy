const mongoose = require('mongoose');

const voteTypeSchema = new mongoose.Schema({
    type: { type: String, required: true },
});

const VoteType = mongoose.model('VoteType', voteTypeSchema);

module.exports = VoteType;