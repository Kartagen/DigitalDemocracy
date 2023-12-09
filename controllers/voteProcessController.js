const VoteProcess = require('../models/VoteResult');
const Vote = require('../models/Vote');
const Candidate = require("../models/Candidate");
const GovernmentPassport = require('../models/GovermentPassport');
const Role = require("../models/Role")
const {secret} = require("../config");
const jwt = require("jsonwebtoken");

class VoteProcessController {
    async addVote(req, res) {
        try {
            const {voteId, candidateId} = req.body;

            // Перевірка чи голосування і кандидат існують
            const vote = await Vote.findById(voteId);
            const candidate = await Candidate.findById(candidateId);

            if (!vote || !candidate) {
                return res.status(404).json({message: 'Vote or candidate not found.'});
            }

            // Перевірка чи голосування ще триває
            const now = new Date();
            if (now < new Date(vote.beginning) || now > new Date(vote.end)) {
                return res.status(403).json({message: 'Voting is not currently active.'});
            }
            const passportNumber = req.user.passportNumber;
            const governmentPassport = await GovernmentPassport.findOne({passportNumber});

            if (!governmentPassport) {
                return res.status(404).json({message: 'Government passport not found.'});
            }
            // Перевірка чи голосував користувач вже
            const existingVoteProcess = await VoteProcess.findOne({voteId, governmentPassport: governmentPassport._id});

            if (existingVoteProcess) {
                return res.status(400).json({message: 'User has already voted in this election.'});
            }

            const isCityVoting = await Vote.findById(voteId)
            if (isCityVoting.city !== "" && isCityVoting.city !== undefined && isCityVoting.city !== governmentPassport.cityOfResidence) {
                return res.status(403).json({message: 'You are not allowed to vote in this city.'});
            }
            // Створення запису голосування
            const newVoteProcess = new VoteProcess({
                voteId,
                governmentPassport: governmentPassport._id,
                candidateId,
            });

            // Збереження голосування в базі даних
            await newVoteProcess.save();

            return res.status(201).json({message: 'Vote added successfully.'});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async verify(req, res) {
        try {
            // Отримуємо токен з заголовка
            const token = req.headers.authorization.split(' ')[1];

            // Розшифровуємо токен та отримуємо дані
            const decodedToken = jwt.verify(token, secret);

            // Отримуємо паспорт з бази даних
            const passport = await GovernmentPassport.findOne({ passportNumber: decodedToken.passportNumber });

            // Перевірка, чи паспорт існує та валідний
            if (!passport) {
                return res.status(400).json({ message: 'Invalid passport.' });
            }
            const roleU = await Role.findById(decodedToken.userRole)

            // Повертаємо ім'я та фамілію
            return res.status(200).json({ name: passport.name, surname: passport.surname, role: roleU.role });
        }catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}

module.exports = new VoteProcessController();