const Candidate = require('../models/Candidate');

class CandidateController {
    async registration(req, res) {
        try {
            const { name, surname, aboutCandidate } = req.body;

            // Перевірка наявності обов'язкових полів
            if (!name || !surname) {
                return res.status(400).json({ message: 'Name and surname are required fields.' });
            }

            // Створення нового кандидата
            const newCandidate = new Candidate({ name, surname, aboutCandidate });

            // Збереження кандидата в базу даних
            await newCandidate.save();

            return res.status(201).json({ message: 'Candidate registered successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getAllCandidates(req, res) {
        try {
            // Отримання усіх кандидатів з бази даних
            const candidates = await Candidate.find();

            // Відправлення відповіді зі списком кандидатів
            res.status(200).json(candidates);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async update(req, res) {
        try {
            const candidateId = req.params.id;
            const { name, surname, aboutCandidate } = req.body;

            // Перевірка наявності обов'язкових полів
            if (!name || !surname) {
                return res.status(400).json({ message: 'Name and surname are required fields.' });
            }

            // Зміна кандидата в базі даних за його ідентифікатором
            await Candidate.findByIdAndUpdate(candidateId, { name, surname, aboutCandidate });

            return res.status(200).json({ message: 'Candidate updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const candidateId = req.params.id;

            // Видалення кандидата з бази даних за його ідентифікатором
            await Candidate.findByIdAndDelete(candidateId);

            return res.status(200).json({ message: 'Candidate deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new CandidateController();