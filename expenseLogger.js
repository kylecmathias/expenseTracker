const fs = require('fs');
const path = require('path');

function getExpenseHistory(expenseFilePath) {
    try {
        if (!fs.existsSync(expenseFilePath)) {
            console.log('No expense data available.');
            return [];
        }

        const files = fs.readdirSync(expenseFilePath);
        return files.map(file => file.split('/')[0]);
    } catch (error) {
        console.error('Error getting expense history:', error.message);
        return [];
    }
}

function logExpense(date, loadedData, loadedFilePath) {
    const readlineSync = require('readline-sync');

    console.log('Expense Categories:');
    console.log('1. Category 1');
    console.log('2. Category 2');

    const categoryChoice = readlineSync.questionInt('Choose a category (enter the number): ');

    const expenseAmount = readlineSync.questionFloat('Enter the expense amount: ');

    const dataObject = JSON.parse(loadedData);

    if (dataObject[date]) {
        dataObject[date][`Category ${categoryChoice}`] = expenseAmount;
    } else {
        dataObject[date] = {
            [`Category ${categoryChoice}`]: expenseAmount,
        };
    }

    saveToFile(loadedFilePath, JSON.stringify(dataObject));

    console.log('Expense logged successfully.');
}


module.exports = {
    logExpense,
    getExpenseHistory,
};
