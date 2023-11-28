const readlineSync = require('readline-sync');
const saveDataModule = require('./saveDataModule');
const dateUtils = require('./dateUtils');
const loadDataModule = require('./loadDataModule');
const { saveToFile, readFromFile } = require('./fileManager');
const { logExpense, getExpenseHistory } = require('./expenseLogger');
const fs = require('fs');
const path = require('path');

loadDataResult = {loadedData: 0, loadedFilePath: 0};

function mainMenu() {
    while (true) {
        console.log('Expense Tracker - Main Menu');
        console.log('1. Log Purchase');
        console.log('2. Edit Preferences');
        console.log('3. See Expense History');
        console.log('4. Save Data');
        console.log('5. Load Data');
        console.log('0. Exit');

        const choice = readlineSync.questionInt('Enter your choice: ');

        switch (choice) {
            case 1:
                logPurchase(loadDataResult.loadedData, loadDataResult.loadedFilePath);
                break;
            case 2:
                editPreferences(loadDataResult.loadedFilePath);
                break;
            case 3:
                seeExpenseHistory(loadDataResult.loadedData, loadDataResult.loadedFilePath);
                break;
            case 4:
                saveDataModule.saveData();
                break;
            case 5:
                loadDataResult = loadDataModule.loadData();

                break;
            case 0:
                console.log('Exiting...');
                return 0;
            default:
                console.log('Invalid choice. Please try again.');
                mainMenu();
        }
    }
}

function logPurchase(loadedData, loadedFilePath) {
    try {
        const spentAmount = readlineSync.questionFloat('Enter the amount spent: ');

        console.log('Select a category:');
        console.log('1. Total Money');
        console.log('2. Monthly Budget');
        console.log('3. Chequing');
        console.log('4. Savings');
        console.log('5. Investments');
        console.log('6. Subscriptions');
        console.log('7. Spending Money');

        const categoryChoice = readlineSync.questionInt('Enter your choice: ');

        if (categoryChoice < 1 || categoryChoice > 7) {
            console.error('Invalid category choice. Aborting purchase log.');
            mainMenu();
            return;
        }

        const categoryMapping = {
            1: 'Total Money',
            2: 'Monthly Budget',
            3: 'Chequing',
            4: 'Savings',
            5: 'Investments',
            6: 'Subscriptions',
            7: 'Spending Money',
        };

        const selectedCategory = categoryMapping[categoryChoice];

        if (!selectedCategory) {
            console.error('Error mapping category. Aborting purchase log.');
            mainMenu();
            return;
        }

        let currentDate = dateUtils.getCurrentDate();

        const parsedData = JSON.parse(loadedData);

    if (!parsedData[currentDate]) {

        const lastDate = Object.keys(parsedData).pop();

        parsedData[currentDate] = { ...parsedData[lastDate] };
        parsedData[currentDate][selectedCategory] -= spentAmount;

        if (parsedData[currentDate][selectedCategory] < 0) {
            console.warn('Warning: Category balance is below zero.');
        }
    }

        parsedData[currentDate][selectedCategory] -= spentAmount;

        if (parsedData[currentDate][selectedCategory] < 0) {
            console.warn('Warning: Category balance is below zero.');
        }

        saveToFile(loadedFilePath, JSON.stringify(parsedData, null, 2));

        console.log(`Purchase logged successfully. ${spentAmount} deducted from ${selectedCategory}.`);
    } catch (error) {
        console.error('Error logging purchase:', error.message);
    }

    mainMenu();
}




function editPreferences(path) {
    console.log('Edit Preferences Menu');
    console.log('1. Edit Total Money');
    console.log('2. Edit Monthly Budget');
    console.log('3. Edit Chequing');
    console.log('4. Edit Savings');
    console.log('5. Edit Investments');
    console.log('6. Edit Subscriptions');
    console.log('7. Edit Spending Money');
    console.log('0. Back to Main Menu');

    const choice = readlineSync.questionInt('Enter your choice: ');

    switch (choice) {
        case 1:
            editPreference('Total Money', path);
            break;
        case 2:
            editPreference('Monthly Budget', path);
            break;
        case 3:
            editPreference('Chequing', path);
            break;
        case 4:
            editPreference('Savings', path);
            break;
        case 5:
            editPreference('Investments', path);
            break;
        case 6:
            editPreference('Subscriptions', path);
            break;
        case 7:
            editPreference('Spending Money', path);
            break;
        case 0:
            console.log('Returning to Main Menu...');
            mainMenu();
            break;
        default:
            console.log('Invalid choice. Please try again.');
            editPreferences();
    }
}

function editPreference(preferenceName, filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const parsedData = JSON.parse(fileContent);

        const allDates = Object.keys(parsedData);

        if (allDates.length === 0) {
            console.error('No dates found in loaded data. Unable to edit.');
            return;
        }

        const latestDate = allDates.reduce((latest, date) => {
            return new Date(date) > new Date(latest) ? date : latest;
        }, allDates[0]);

        const currentPreferences = parsedData[latestDate];

        if (!currentPreferences) {
            console.error('Preferences are null. Unable to edit.');
            return;
        }

        const currentPreferenceValue = currentPreferences[preferenceName];

        if (currentPreferenceValue === undefined) {
            console.error(`Invalid preference name: ${preferenceName}`);
            return;
        }

        console.log(`Current value for ${preferenceName}: ${currentPreferenceValue}`);

        const newValue = readlineSync.question(`Enter new value for ${preferenceName}: `);

        currentPreferences[preferenceName] = newValue;

        fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');

        console.log(`Preference ${preferenceName} updated successfully.`);
    } catch (error) {
        console.error('Error editing preferences:', error.message);
    }
}

function seeExpenseHistory(loadedData, loadedFilePath) {
    if (!loadedData || !loadedFilePath) {
        console.log('Error: No file loaded. Returning to the main menu.');
        mainMenu();
        return;
    }

    const dataObject = JSON.parse(loadedData);

    console.log('Expense History:');

    const dates = Object.keys(dataObject);
    dates.forEach((date, index) => {
        console.log(`${index + 1}. ${date}`);
    });

    if (dates.length === 0) {
        console.log('No dates available. Returning to the main menu.');
        mainMenu();
        return;
    }

    const selectedDateIndex = readlineSync.questionInt('Select a date (enter index): ') - 1;

    if (selectedDateIndex >= 0 && selectedDateIndex < dates.length) {
        const selectedDate = dates[selectedDateIndex];
        console.log(`Selected Date: ${selectedDate}`);

        const selectedData = dataObject[selectedDate];
        Object.keys(selectedData).forEach((property) => {
            console.log(`   ${property}: ${selectedData[property]}`);
        });

    } else {
        console.log('Invalid index. Returning to the main menu.');
    }

    mainMenu();
}

mainMenu();