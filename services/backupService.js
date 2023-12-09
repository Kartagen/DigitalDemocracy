const fs = require("fs");
const moment = require("moment");
const path = require("path");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const VoteCandidate = require("../models/VoteCandidate");
const VoteResult = require("../models/VoteResult");
const User = require("../models/User");
const rootFolderPath = path.join(__dirname, '../backups/');

function findLastBackupFolder(directory) {
    const folders = fs.readdirSync(directory);
    const sortedFolders = folders
        .filter(folder => fs.statSync(path.join(directory, folder)).isDirectory())
        .sort((a, b) => {
            const aDate = moment(a, 'YYYY-MM-DD', true);
            const bDate = moment(b, 'YYYY-MM-DD', true);
            return bDate - aDate;
        });

    return sortedFolders[0];
}
async function autoBackup(){
    const currentDate = moment().format('YYYY-MM-DD');
    const todayFolderPath = path.join(rootFolderPath, currentDate);
    const isExist = fs.existsSync(todayFolderPath);
    if(!isExist) {
        try {
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

            console.log('Data exported successfully.', filePath);
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = {findLastBackupFolder,autoBackup}