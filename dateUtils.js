const fs = require('fs');
const path = require('path');

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function getIndexedDate(date, formattedDate) {
    const existingSaves = getExistingSaves(formattedDate);

    return `${formattedDate}/${(existingSaves + 1).toString().padStart(3, '0')}`;
}

function getExistingSaves(formattedDate) {
    const expenseDataPath = './expenseData'; 

    if (!fs.existsSync(expenseDataPath)) {
        return 0; 
    }

    const filesInDirectory = fs.readdirSync(expenseDataPath);

    const matchingFiles = filesInDirectory.filter((file) => {
        const fileName = path.parse(file).name; 
        return fileName.startsWith(formattedDate);
    });

    return matchingFiles.length;
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
}

module.exports = {
    formatDate,
    getIndexedDate,
    getExistingSaves,
    getCurrentDate,
};
