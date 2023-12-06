const fs = require("fs");
const moment = require("moment");
const controller = require("../controllers/staffController");
const path = require("path");
const rootFolderPath = path.join(__dirname, './backups/');

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
function autoBackup(){
    const currentDate = moment().format('YYYY-MM-DD');
    const todayFolderPath = path.join(rootFolderPath, currentDate);
    if(!fs.existsSync(todayFolderPath)) controller.exportData().then();
}
module.exports = {findLastBackupFolder,autoBackup}