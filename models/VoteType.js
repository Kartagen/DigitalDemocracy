const mongoose = require('mongoose');

const voteTypeSchema = new mongoose.Schema({
    voteTypeId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    type: { type: String, required: true },
});

const VoteType = mongoose.model('VoteType', voteTypeSchema);

module.exports = VoteType;