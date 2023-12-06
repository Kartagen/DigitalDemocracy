const VoteResult = require("../models/VoteResult");
const Candidate = require("../models/Candidate");
const calculateCandidatesInfo = async (voteId) => {
// Отримати результати голосування для даного голосування
    const voteResults = await VoteResult.find({voteId}).populate('candidateId', 'name surname');

// Підрахувати кількість людей, які взяли участь
    const participantsCount = voteResults.length;

// Підготувати інформацію про кандидатів та кількість голосів за них
    const candidatesInfo = [];
    const candidates = await Candidate.find({_id: {$in: voteResults.map(result => result.candidateId)}});

    for (const candidate of candidates) {
        const votesForCandidate = voteResults.filter(result => result.candidateId.equals(candidate._id)).length;
        candidatesInfo.push({
            id:candidate._id,
            name:candidate.name,
            surname:candidate.surname,
            aboutCandidate:candidate.aboutCandidate,
            votes: votesForCandidate,
        });
    }
    return {info:candidatesInfo, count:participantsCount};
}

module.exports = {calculateCandidatesInfo}