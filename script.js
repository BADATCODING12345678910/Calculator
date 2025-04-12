document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const memoryIndicator = document.getElementById('memory-indicator');
    const historyIndicator = document.getElementById('history-indicator');
    
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let memoryValue = 0;
    let calculationHistory = [];

    // Helper function to update display
    const updateDisplay = (value) => {
        display.value = value;
    };

    // Helper function to update history
    const updateHistory = (text) => {
        history.textContent = text;
        historyIndicator.classList.toggle('hidden', !text);
    };

    // Helper function to handle number input
    const handleNumber = (number) => {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        if (currentInput.length < 15) { // Limit input length
            currentInput += number;
            updateDisplay(currentInput);
        }
    };

    // Helper function to handle operations
    const handleOperation = (op) => {
        if (currentInput === '') return;
        
        if (previousInput !== '') {
            calculate();
        }
        
        operation = op;
        previousInput = currentInput;
        currentInput = '';
        updateHistory(`${previousInput} ${operation}`);
    };

    // Helper function to calculate result
    const calculate = () => {
        if (previousInput === '' || currentInput === '' || operation === null) return;

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }

        // Add to history
        calculationHistory.push(`${previousInput} ${operation} ${currentInput} = ${result}`);
        if (calculationHistory.length > 5) {
            calculationHistory.shift();
        }

        currentInput = result.toString();
        previousInput = '';
        operation = null;
        shouldResetDisplay = true;
        updateDisplay(currentInput);
        updateHistory('');
    };

    // Memory functions
    const memoryFunctions = {
        mc: () => {
            memoryValue = 0;
            memoryIndicator.classList.add('hidden');
        },
        mr: () => {
            if (memoryValue !== 0) {
                currentInput = memoryValue.toString();
                updateDisplay(currentInput);
            }
        },
        'm-plus': () => {
            if (currentInput) {
                memoryValue += parseFloat(currentInput);
                memoryIndicator.classList.remove('hidden');
            }
        },
        'm-minus': () => {
            if (currentInput) {
                memoryValue -= parseFloat(currentInput);
                memoryIndicator.classList.remove('hidden');
            }
        },
        ms: () => {
            if (currentInput) {
                memoryValue = parseFloat(currentInput);
                memoryIndicator.classList.remove('hidden');
            }
        }
    };

    // Add event listeners to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            const id = button.id;

            if (button.classList.contains('number')) {
                handleNumber(value);
            } else if (button.classList.contains('operator')) {
                if (value === '±') {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                    updateDisplay(currentInput);
                } else {
                    handleOperation(value);
                }
            } else if (button.classList.contains('equals')) {
                calculate();
            } else if (button.classList.contains('clear')) {
                currentInput = '';
                previousInput = '';
                operation = null;
                updateDisplay('');
                updateHistory('');
            } else if (button.classList.contains('memory')) {
                memoryFunctions[id]();
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Handle numbers
        if (/[0-9]/.test(key)) {
            handleNumber(key);
        }
        // Handle operations
        else if (['+', '-', '*', '/', '%'].includes(key)) {
            const opMap = {
                '*': '×',
                '/': '÷'
            };
            handleOperation(opMap[key] || key);
        }
        // Handle equals
        else if (key === '=' || key === 'Enter') {
            calculate();
        }
        // Handle clear
        else if (key === 'Escape' || key === 'c' || key === 'C') {
            currentInput = '';
            previousInput = '';
            operation = null;
            updateDisplay('');
            updateHistory('');
        }
        // Handle decimal point
        else if (key === '.') {
            if (!currentInput.includes('.')) {
                handleNumber('.');
            }
        }
    });
}); 