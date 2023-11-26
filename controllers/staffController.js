const User = require("../models/User");
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const {secret} = require("../config")
const QRCode = require('qrcode');
const VoteResult = require("../models/VoteResult");
const GovernmentPassport = require("../models/GovermentPassport");

class staffController {
    async generateQrLogin(req, res) {
        try {
            const { passportNumber, votingId } = req.body;
            const passportExists = await GovernmentPassport.findOne({ passportNumber });
            if (!passportExists) {
                return res.status(400).json({ message: 'Passport number not found in the database' });
            }

            // Перевірка віку користувача
            const userAge = calculateAge(passportExists.dateOfBirth);
            if (userAge < 18) {
                return res.status(400).json({ message: 'User is under 18 years old' });
            }

            // Перевірка, чи номер паспорту вже використовується у цьому голосуванні
            const userExistsInVoting = await VoteResult.findOne({ passportNumber, votingId });
            if (userExistsInVoting) {
                return res.status(400).json({ message: 'Passport number already used in this voting' });
            }

            // Генерація JWT-токена з вбудованим паспортом та ідентифікатором голосування
            const accessToken = generateAccessToken(passportNumber, votingId);

            // Генерація QR-кода з вбудованим токеном
            QRCode.toDataURL(accessToken, (err, qrcode) => {
                if (err) {
                    console.error('Error generating QR code:', err);
                    return res.status(500).json({ message: 'Error generating QR code' });
                }

                // Відправка QR-кода у відповіді
                res.send(`<img src="${qrcode}" alt="QR Code"/>`);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
function calculateAge(birthDate) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
}
const generateAccessToken = (passportNumber, votingId) => {
    const payload = {
        passportNumber,
        votingId
    }
    return jwt.sign(payload, secret, { expiresIn: 60 * 10 });
};
module.exports = new staffController();