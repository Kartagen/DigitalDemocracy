const mongoose = require('mongoose');

const voteResultSchema = new mongoose.Schema({
    governmentPassport: { type: mongoose.Schema.Types.ObjectId, ref: 'GovernmentPassport', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    voteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true },
});

const VoteResult = mongoose.model('VoteResult', voteResultSchema);

module.exports = VoteResult;