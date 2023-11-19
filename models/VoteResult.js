const mongoose = require('mongoose');

const voteResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    voteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true },
});

const VoteResult = mongoose.model('VoteResult', voteResultSchema);

module.exports = VoteResult;