const VoteProcess = require('../models/VoteResult');
const Vote = require('../models/Vote');
const Candidate = require("../models/Candidate");
const GovernmentPassport = require('../models/GovermentPassport');

class VoteProcessController {
    async addVote(req, res) {
        try {
            const { voteId, candidateId } = req.body;

            // Перевірка чи голосування і кандидат існують
            const vote = await Vote.findById(voteId);
            const candidate = await Candidate.findById(candidateId);

            if (!vote || !candidate) {
                return res.status(404).json({ message: 'Vote or candidate not found.' });
            }

            // Перевірка чи голосування ще триває
            const now = new Date();
            if (now < new Date(vote.beginning) || now > new Date(vote.end)) {
                return res.status(403).json({ message: 'Voting is not currently active.' });
            }
            const passportNumber = req.user.passportNumber;
            const governmentPassport = await GovernmentPassport.findOne({ passportNumber });

            if (!governmentPassport) {
                return res.status(404).json({ message: 'Government passport not found.' });
            }
            // Перевірка чи голосував користувач вже
            const existingVoteProcess = await VoteProcess.findOne({ voteId, governmentPassport: governmentPassport._id });

            if (existingVoteProcess) {
                return res.status(400).json({ message: 'User has already voted in this election.' });
            }

            const isCityVoting = await Vote.findById(voteId)
            if(isCityVoting.city!="" && isCityVoting.city!=governmentPassport.cityOfResidence){
                return res.status(403).json({ message: 'You are not allowed to vote in this city.' });
            }
            // Створення запису голосування
            const newVoteProcess = new VoteProcess({
                voteId,
                governmentPassport: governmentPassport._id,
                candidateId,
            });

            // Збереження голосування в базі даних
            await newVoteProcess.save();

            return res.status(201).json({ message: 'Vote added successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new VoteProcessController();