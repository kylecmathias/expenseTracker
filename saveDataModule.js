const {saveToFile} = require('./fileManager');
const {loadPreferences, savePreferences} = require('./preferencesManager');
const {getExpenseHistory} = require('./expenseLogger');

function saveData() {
    const preferences = loadPreferences();
    const expenses = getExpenseHistory();

    savePreferences(preferences);
    saveExpenseHistory(expenses);

    console.log('Data saved successfully.');
}

function saveExpenseHistory(expenses) {
   
}

module.exports = {saveData};
