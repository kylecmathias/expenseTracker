const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const { saveToFile } = require('./fileManager');
const dateUtils = require('./dateUtils');

let loadedData;
let loadedFilePath;

function loadData() {
    console.log('Load Data Menu');
    console.log('1. Create New File');
    console.log('2. Load Existing File');
    console.log('0. Back to Main Menu');

    const choice = readlineSync.questionInt('Enter your choice: ');

    switch (choice) {
        case 1:
            result = createNewFile();
            if (result) {
                defaultData = result.loadedData;
                fullFilePath = result.loadedFilePath;
            }
            return { loadedData: defaultData, loadedFilePath: fullFilePath };
        case 2:
            result = loadExistingFile();
            if (result) {
                fileData = result.loadedData;
                fileFullFilePath = result.loadedFilePath;
            }
            return { loadedData: fileData, loadedFilePath: fileFullFilePath };
        case 0:
            console.log('Returning to Main Menu...');
            return { loadedData: 0, loadedFilePath: 0 };
        default:
            console.log('Invalid choice. Please try again.');
            loadData();
    }
}

function createNewFile() {
    const filename = readlineSync.question('Enter a filename: ');
    let filepath = readlineSync.question('Enter the file path: ');

    filepath = filepath.replace(/^"(.*)"$/, '$1');

    const fullFilePath = path.join(filepath, `${filename}.expt`);

    try {
        fs.writeFileSync(fullFilePath, '');

        const defaultData = {
            "01/01/2023/001": {
                "Total Money": 0,
                "Monthly Budget": 0,
                "Chequing": 0,
                "Savings": 0,
                "Investments": 0,
                "Subscriptions": 0,
                "Spending Money": 0
            }
        }; 

        const defaultDataString = JSON.stringify(defaultData, null, 2);

        fs.appendFileSync(fullFilePath, defaultDataString);

        console.log(`New file created successfully at: ${fullFilePath}`);

        return { loadedData: defaultDataString, loadedFilePath: fullFilePath };
    } catch (error) {
        console.error(`Error creating file: ${error.message}`);
        return null;
    }
}

function loadExistingFile() {
    let filePath = readlineSync.question('Enter the file location: ');

    if (filePath.startsWith('"') && filePath.endsWith('"')) {
        filePath = filePath.slice(1, -1);
    }

    try {
        const fileContents = fs.readFileSync(filePath, 'utf-8');

        console.log('File loaded successfully.');

        return { loadedData: fileContents, loadedFilePath: filePath };
    } catch (error) {
        console.error(`Error loading file: ${error.message}`);
        return null;
    }
}

function getLoadedData() {
    return loadedData;
}

function getLoadedFilePath() {
    return loadedFilePath;
}

module.exports = {
    loadData,
    getLoadedData,
    getLoadedFilePath,
};
