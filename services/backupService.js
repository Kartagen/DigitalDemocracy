const fs = require("fs");
const path = require("path");
const moment = require("moment");

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
module.exports = {findLastBackupFolder}