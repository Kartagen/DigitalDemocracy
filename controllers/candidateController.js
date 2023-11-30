const Candidate = require('../models/Candidate');

class CandidateController {
    // Реєстрація нового кандидату
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
    // Отримання усіх кандидатів у базі даних
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
    // Оновлення даних кандидату
    async update(req, res) {
        try {
            const candidateId = req.params.id;
            const { name, surname, aboutCandidate } = req.body;

            // Знайти кандидата за його ідентифікатором
            const candidate = await Candidate.findById(candidateId);

            // Перевірити, чи існує кандидат з вказаним ідентифікатором
            if (!candidate) {
                return res.status(404).json({ message: 'Candidate not found.' });
            }

            // Зміна кандидата в базі даних за його ідентифікатором
            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (surname) updatedFields.surname = surname;
            if (aboutCandidate) updatedFields.aboutCandidate = aboutCandidate;

            await Candidate.findByIdAndUpdate(candidateId, updatedFields);

            return res.status(200).json({ message: 'Candidate updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    // Видалення кандидату
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