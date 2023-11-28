const fs = require('fs');

function saveToFile(filePath, content) {
    if (!filePath) {
        console.error('File path is undefined.');
        return;
    }
    fs.writeFileSync(filePath, content, 'utf-8');
}

function readFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

module.exports = {saveToFile, readFromFile};
