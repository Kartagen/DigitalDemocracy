const Vote = require('../models/Vote');
const Candidate = require("../models/Candidate");
const VoteCandidate = require("../models/VoteCandidate");
const moment = require('moment');
const {calculateCandidatesInfo} = require("../services/voteResultService");
class VoteController {
    // Додавання нового голосування
    async create(req, res) {
        try {
            const {name, beginning, end, type, city, candidates} = req.body;

            // Перевірка наявності обов'язкових полів
            if (!name || !beginning || !end || !type || !candidates) {
                return res.status(400).json({message: 'Name, beginning, end, type, and candidates are required fields.'});
            }

            // Перевірка наявності кандидатів у базі даних
            const existingCandidates = await Candidate.find({_id: {$in: candidates}});
            if (existingCandidates.length !== candidates.length) {
                return res.status(400).json({message: 'Invalid candidates provided.'});
            }

            // Перевірка правильності часу
            const beginningDate = moment(beginning);
            const endDate = moment(end);

            if (!beginningDate.isValid() || !endDate.isValid() || beginningDate.isSameOrAfter(endDate)) {
                return res.status(400).json({message: 'Invalid time range. Beginning should be before end.'});
            }

            // Перевірка, що голосування створюється не менше ніж за день до початку
            const currentDate = moment();
            if (beginningDate.isSameOrBefore(currentDate.add(1, 'day'))) {
                return res.status(400).json({message: 'Voting can only be created at least one day before the beginning.'});
            }

            // Створення нового голосування
            const newVote = new Vote({name, beginning, end, type, city});

            // Збереження голосування в базу даних
            await newVote.save();

            // Додавання кандидатів до голосування через модель VoteCandidate
            for (const candidateId of candidates) {
                const voteCandidate = new VoteCandidate({voteId: newVote._id, candidateId});
                await voteCandidate.save();
            }

            return res.status(201).json({message: 'Voting created successfully.'});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    // Оновлення інформації про голосування
    async update(req, res) {
        try {
            const voteId = req.params.id;
            const { name, beginning, end, type, city, candidates } = req.body;

            // Знайти голосування за його ідентифікатором
            const vote = await Vote.findById(voteId);

            // Перевірити, чи існує голосування з вказаним ідентифікатором
            if (!vote) {
                return res.status(404).json({ message: 'Voting not found.' });
            }

            // Перевірити, чи не минуло години до початку голосування
            const now = moment();
            const beginningMoment = moment(vote.beginning);

            if (now.isSameOrAfter(beginningMoment.subtract(1, 'hour'))) {
                return res.status(403).json({ message: 'It is not allowed to update the voting within an hour before it starts.' });
            }
            const beginningDate = moment(beginning);
            const endDate = moment(end);

            if (!beginningDate.isValid() || !endDate.isValid() || beginningDate.isSameOrAfter(endDate)) {
                return res.status(400).json({message: 'Invalid time range. Beginning should be before end.'});
            }

            // Зміна голосування в базі даних за його ідентифікатором
            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (beginning) updatedFields.beginning = beginning;
            if (end) updatedFields.end = end;
            if (type) updatedFields.type = type;
            if (city) updatedFields.city = city;

            await Vote.findByIdAndUpdate(voteId, updatedFields);

            // Перевірка та оновлення кандидатів голосування
            if (candidates && Array.isArray(candidates)) {
                // Перевірка наявності кандидатів у базі даних
                const existingCandidates = await Candidate.find({ _id: { $in: candidates } });
                if (existingCandidates.length === candidates.length) {
                    // Видалення поточних кандидатів голосування
                    await VoteCandidate.deleteMany({ voteId });

                    // Додавання нових кандидатів до голосування через модель VoteCandidate
                    for (const candidateId of candidates) {
                        const voteCandidate = new VoteCandidate({ voteId, candidateId });
                        await voteCandidate.save();
                    }
                } else {
                    return res.status(400).json({ message: 'Invalid candidates provided.' });
                }
            }

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
            const now = moment();
            const beginningMoment = moment(vote.beginning);

            if (now.isSameOrAfter(beginningMoment.subtract(1, 'hour'))) {
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
            const vote = await Vote.findById(voteId).select('-__v');

            // Перевірити, чи існує голосування з вказаним ідентифікатором
            if (!vote) {
                return res.status(404).json({ message: 'Voting not found.' });
            }

            // Знайти кандидатів, пов'язаних з цим голосуванням
            const candidates = await VoteCandidate.find({ voteId }).populate('candidateId').select('-__v -voteId').lean()
            candidates.forEach(candidate => delete candidate.candidateId.__v);
            // Повернути голосування та його кандидатів у відповіді
            return res.status(200).json({ vote, candidates });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getFilteredVotes(req, res) {
        try {
            const { type, city, available } = req.query;

            // Формування об'єкта фільтрації
            const filter = {};
            if (type) filter.type = type; // Фільтрація за типом
            if (city) filter.city = city; // Фільтрація за містом
            if (available) {
                // Фільтрація за доступністю (чи голосування відбувається зараз)
                const now = new Date();
                filter.beginning = { $lte: now };
                filter.end = { $gte: now };
            }
            // Отримання голосувань з використанням фільтра
            const votes = await Vote.find(filter)
                .populate('type', 'type')
                .select('-__v')
                .exec();
            // Повернення відфільтрованих голосувань у відповіді
            return res.status(200).json({ votes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getVoteResults(req, res) {
        try {
            const voteId = req.params.id;

            // Знайти голосування за його ідентифікатором
            const vote = await Vote.findById(voteId);

            // Перевірити, чи існує голосування з вказаним ідентифікатором
            if (!vote) {
                return res.status(404).json({ message: 'Voting not found.' });
            }

            // Перевірити, чи голосування вже завершено
            const now = new Date();
            if (now < vote.end) {
                return res.status(403).json({ message: 'Voting results are not available yet.' });
            }
            const candidatesResult = await calculateCandidatesInfo(voteId);
            const info = candidatesResult.info;
            const count = candidatesResult.count;
            // Повернути результати голосування
            return res.status(200).json({
                vote: {
                    _id: vote._id,
                    name: vote.name,
                    beginning: vote.beginning,
                    end: vote.end,
                    type: vote.type,
                    city: vote.city,
                },
                count,
                info,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new VoteController();