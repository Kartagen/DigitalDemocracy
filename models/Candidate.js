const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    aboutCandidate: { type: String },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;