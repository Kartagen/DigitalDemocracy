const mongoose = require('mongoose');
const voteCandidateSchema = new mongoose.Schema({
    voteCandidateId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    voteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
});

const VoteCandidate = mongoose.model('VoteCandidate', voteCandidateSchema);

module.exports = VoteCandidate;