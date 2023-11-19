const mongoose = require('mongoose');
const voteCandidateSchema = new mongoose.Schema({
    voteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
});

const VoteCandidate = mongoose.model('VoteCandidate', voteCandidateSchema);

module.exports = VoteCandidate;