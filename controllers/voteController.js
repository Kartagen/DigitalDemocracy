const Vote = require('../models/Vote');
const Candidate = require("../models/Candidate");
const VoteCandidate = require("../models/VoteCandidate");

class VoteController {
    // Додавання нового голосування
    async create(req, res) {
        try {
            const { name, beginning, end, type, city, candidates } = req.body;

            // Перевірка наявності обов'язкових полів
            if (!name || !beginning || !end || !type || !candidates) {
                return res.status(400).json({ message: 'Name, beginning, end, type, and candidates are required fields.' });
            }

            // Перевірка наявності кандидатів у базі даних
            const existingCandidates = await Candidate.find({ _id: { $in: candidates } });
            if (existingCandidates.length !== candidates.length) {
                return res.status(400).json({ message: 'Invalid candidates provided.' });
            }

            // Створення нового голосування
            const newVote = new Vote({ name, beginning, end, type, city });

            // Збереження голосування в базу даних
            await newVote.save();

            // Додавання кандидатів до голосування через модель VoteCandidate
            for (const candidateId of candidates) {
                const voteCandidate = new VoteCandidate({ voteId: newVote._id, candidateId });
                await voteCandidate.save();
            }

            return res.status(201).json({ message: 'Voting created successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Оновлення інформації про голосування
    async update(req, res) {
        try {
            const voteId = req.params.id;
            const { name, beginning, end, type, city } = req.body;

            // Знайти голосування за його ідентифікатором
            const vote = await Vote.findById(voteId);

            // Перевірити, чи існує голосування з вказаним ідентифікатором
            if (!vote) {
                return res.status(404).json({ message: 'Voting not found.' });
            }

            // Перевірити, чи не минуло години до початку голосування
            const now = new Date();
            if (now >= new Date(vote.beginning - 1 * 60 * 60 * 1000)) {
                return res.status(403).json({ message: 'It is not allowed to update the voting within an hour before it starts.' });
            }

            // Зміна голосування в базі даних за його ідентифікатором
            await Vote.findByIdAndUpdate(voteId, { name, beginning, end, type, city });

            return res.status(200).json({ message: 'Voting updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Видалення голосування за його ідентифікатором
    async delete(req, res) {
        try {
            const voteId = req.params.id;

            // Знайти голосування за його ідентифікатором
            const vote = await Vote.findById(voteId);

            // Перевірити, чи існує голосування з вказаним ідентифікатором
            if (!vote) {
                return res.status(404).json({ message: 'Voting not found.' });
            }

            // Перевірити, чи не минуло години до початку голосування
            const now = new Date();
            if (now >= new Date(vote.beginning - 1 * 60 * 60 * 1000)) {
                return res.status(403).json({ message: 'It is not allowed to delete the voting within an hour before it starts.' });
            }

            // Видалення голосування з бази даних за його ідентифікатором
            await Vote.findByIdAndDelete(voteId);

            return res.status(200).json({ message: 'Voting deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getWithCandidates(req, res) {
        try {
            const voteId = req.params.id;

            // Знайти голосування за його ідентифікатором
            const vote = await Vote.findById(voteId);

            // Перевірити, чи існує голосування з вказаним ідентифікатором
            if (!vote) {
                return res.status(404).json({ message: 'Voting not found.' });
            }

            // Знайти кандидатів, пов'язаних з цим голосуванням
            const candidates = await VoteCandidate.find({ voteId }).populate('candidateId');

            // Повернути голосування та його кандидатів у відповіді
            return res.status(200).json({ vote, candidates });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new VoteController();