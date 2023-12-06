const QRCode = require('qrcode');
const VoteResult = require("../models/VoteResult");
const GovernmentPassport = require("../models/GovermentPassport");
const Vote = require("../models/Vote");
const {generateAccessToken} = require("../services/jwtService");
const {calculateAge} = require("../services/ageService");
const Candidate = require("../models/Candidate");
const VoteCandidate = require("../models/VoteCandidate");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const moment = require('moment');
const {findLastBackupFolder} = require("../services/backupService");
const rootFolderPath = path.join(__dirname, '../backups/');

class staffController {

    // Створення qr-коду персоналом виборчої дільниці
    async generateQrLogin(req, res) {
        try {
            const {passportNumber, votingId} = req.body;
            //Перевірка реальності паспорта
            const passportExists = await GovernmentPassport.findOne({passportNumber});
            if (!passportExists) {
                return res.status(400).json({message: 'Passport number not found in the database'});
            }
            //Перевірка реальності голосування
            const voting = await Vote.findById(votingId);
            if (!voting) {
                return res.status(404).json({message: 'Voting not found.'});
            }
            // Перевірка віку користувача
            const userAge = calculateAge(passportExists.dateOfBirth);
            if (userAge < 18) {
                return res.status(400).json({message: 'User is under 18 years old'});
            }

            // Перевірка, чи номер паспорта вже використовується у цьому голосуванні
            const userExistsInVoting = await VoteResult.findOne({passportNumber, votingId});
            if (userExistsInVoting) {
                return res.status(400).json({message: 'Passport number already used in this voting'});
            }

            // Генерація JWT-токена з вбудованим паспортом та роллю
            const accessToken = generateAccessToken(passportNumber, "655f7227d4fba2e7a2b05f6f");

            // Генерація QR-кода з вбудованим токеном
            QRCode.toDataURL(accessToken, (err, qrcode) => {
                if (err) {
                    console.error('Error generating QR code:', err);
                    return res.status(500).json({message: 'Error generating QR code'});
                }

                // Посилання QR-кода у відповіді
                res.send(`<img src="${qrcode}" alt="QR Code"/>`);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async exportData(req, res) {
        try {
            // Отримати дані з усіх таблиць, окрім GovernmentPassport
            const votes = await Vote.find();
            const candidates = await Candidate.find();
            const voteCandidates = await VoteCandidate.find();
            const voteResults = await VoteResult.find();
            const users = await User.find();

            // Створення об'єкта для зберігання даних
            const exportData = {
                votes,
                candidates,
                voteCandidates,
                voteResults,
                users
            };
            // Зберегти дані у JSON файл
            const currentDate = moment().format('YYYY-MM-DD');
            const todayFolderPath = path.join(rootFolderPath, currentDate);
            if (!fs.existsSync(todayFolderPath)) {
                fs.mkdirSync(todayFolderPath, {recursive: true});
            }
            const filePath = path.join(todayFolderPath, 'exported-data.json');
            fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

            return res.status(200).json({message: 'Data exported successfully.', filePath});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async importData(req, res) {
        try {
            const lastBackupFolder = findLastBackupFolder(rootFolderPath);
            let exportFilePath;
            if (lastBackupFolder) {
                const exportFolderPath = path.join(rootFolderPath, lastBackupFolder);
                exportFilePath = path.join(exportFolderPath, 'exported-data.json');
            }
            const rawData = fs.readFileSync(exportFilePath);
            const importedData = JSON.parse(rawData);
            return res.status(200).json({message: 'Data imported successfully.', data: importedData});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Internal Server Error'});
        }
    }
}

module.exports = new staffController();