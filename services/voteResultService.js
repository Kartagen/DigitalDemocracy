const VoteResult = require("../models/VoteResult");
const Candidate = require("../models/Candidate");
// Функція для отримання інформації про результати голосування
const calculateCandidatesInfo = async (voteId) => {
    // Отримання результатів голосування за вказаним voteId та попереднє завантаження інформації про кандидатів.
    const voteResults = await VoteResult.find({voteId}).populate('candidateId', 'name surname');
    // Обчислення кількості учасників голосування.
    const participantsCount = voteResults.length;
    const candidatesInfo = [];
    // Отримання інформації про кандидатів, використовуючи ідентифікатори кандидатів із результатів голосування.
    const candidates = await Candidate.find({_id: {$in: voteResults.map(result => result.candidateId)}});
    // Обчислення кількості голосів для кожного кандидата та додавання інформації до масиву candidatesInfo.
    for (const candidate of candidates) {
        // Фільтрація результатів голосування за кожним кандидатом.
        const votesForCandidate = voteResults.filter(result => result.candidateId.equals(candidate._id)).length;
        // Додавання інформації про кандидата до масиву candidatesInfo.
        candidatesInfo.push({
            id:candidate._id,
            name:candidate.name,
            surname:candidate.surname,
            aboutCandidate:candidate.aboutCandidate,
            votes: votesForCandidate,
        });
    }
    // Повернення об'єкта, що містить інформацію про кандидатів та кількість учасників голосування.
    return {info:candidatesInfo, count:participantsCount};
}

module.exports = {calculateCandidatesInfo}
