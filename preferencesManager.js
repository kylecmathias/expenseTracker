const { saveToFile, readFromFile } = require('./fileManager');

function savePreferences(preferences, preferencesFilePath) {
    saveToFile(preferencesFilePath, JSON.stringify(preferences));
}

module.exports = { savePreferences};
