document.addEventListener('DOMContentLoaded', () => {
    const result = document.querySelector('.result');
    const history = document.querySelector('.history');
    const historyContent = document.querySelector('.history-content');
    const memoryContent = document.querySelector('.memory-content');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let memoryValue = 0;
    let calculationHistory = [];

    // Helper function to update display
    const updateDisplay = (value) => {
        result.textContent = value;
    };

    // Helper function to update history
    const updateHistory = (text) => {
        history.textContent = text;
    };

    // Helper function to format number
    const formatNumber = (num) => {
        const str = num.toString();
        if (str.includes('e')) return str;
        const parts = str.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    // Helper function to handle number input
    const handleNumber = (number) => {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else if (currentInput.length < 16) {
            currentInput += number;
        }
        updateDisplay(formatNumber(currentInput));
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
        updateHistory(`${formatNumber(previousInput)} ${operation}`);
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
            case '−':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero");
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
        const calculation = `${formatNumber(previousInput)} ${operation} ${formatNumber(currentInput)} = ${formatNumber(result)}`;
        calculationHistory.push(calculation);
        updateHistoryPanel();

        currentInput = result.toString();
        previousInput = '';
        operation = null;
        shouldResetDisplay = true;
        updateDisplay(formatNumber(currentInput));
        updateHistory('');
    };

    // Special functions
    const specialFunctions = {
        '¹/x': () => {
            if (currentInput === '0') {
                alert("Cannot divide by zero");
                return;
            }
            currentInput = (1 / parseFloat(currentInput)).toString();
            updateDisplay(formatNumber(currentInput));
        },
        'x²': () => {
            currentInput = Math.pow(parseFloat(currentInput), 2).toString();
            updateDisplay(formatNumber(currentInput));
        },
        '√x': () => {
            if (parseFloat(currentInput) < 0) {
                alert("Invalid input for square root");
                return;
            }
            currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            updateDisplay(formatNumber(currentInput));
        },
        '±': () => {
            currentInput = (-parseFloat(currentInput)).toString();
            updateDisplay(formatNumber(currentInput));
        },
        'CE': () => {
            currentInput = '0';
            updateDisplay('0');
        },
        'C': () => {
            currentInput = '0';
            previousInput = '';
            operation = null;
            updateDisplay('0');
            updateHistory('');
        },
        '⌫': () => {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay(formatNumber(currentInput));
        }
    };

    // Memory functions
    const memoryFunctions = {
        'mc': () => {
            memoryValue = 0;
            updateMemoryPanel();
        },
        'mr': () => {
            currentInput = memoryValue.toString();
            updateDisplay(formatNumber(currentInput));
        },
        'm-plus': () => {
            memoryValue += parseFloat(currentInput);
            updateMemoryPanel();
        },
        'm-minus': () => {
            memoryValue -= parseFloat(currentInput);
            updateMemoryPanel();
        },
        'ms': () => {
            memoryValue = parseFloat(currentInput);
            updateMemoryPanel();
        }
    };

    // Update history panel
    const updateHistoryPanel = () => {
        if (calculationHistory.length === 0) {
            historyContent.innerHTML = '<p class="no-history">There\'s no history yet.</p>';
        } else {
            historyContent.innerHTML = calculationHistory.map(calc => 
                `<div class="history-item">${calc}</div>`
            ).join('');
        }
    };

    // Update memory panel
    const updateMemoryPanel = () => {
        if (memoryValue === 0) {
            memoryContent.innerHTML = '<p class="no-memory">There\'s nothing saved in memory.</p>';
        } else {
            memoryContent.innerHTML = `<div class="memory-item">${formatNumber(memoryValue)}</div>`;
        }
    };

    // Handle panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.textContent === 'History') {
                historyContent.classList.remove('hidden');
                memoryContent.classList.add('hidden');
            } else {
                historyContent.classList.add('hidden');
                memoryContent.classList.remove('hidden');
            }
        });
    });

    // Add event listeners to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('number')) {
                handleNumber(value);
            } else if (button.classList.contains('operator')) {
                handleOperation(value);
            } else if (button.classList.contains('equals')) {
                calculate();
            } else if (button.classList.contains('function')) {
                if (specialFunctions[value]) {
                    specialFunctions[value]();
                }
            } else if (button.classList.contains('memory')) {
                if (memoryFunctions[button.id]) {
                    memoryFunctions[button.id]();
                }
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        if (/[0-9.]/.test(key)) {
            handleNumber(key);
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            const opMap = {
                '*': '×',
                '/': '÷',
                '-': '−'
            };
            handleOperation(opMap[key] || key);
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape') {
            specialFunctions['C']();
        } else if (key === 'Backspace') {
            specialFunctions['⌫']();
        }
    });

    // Initialize displays
    updateDisplay('0');
    updateHistoryPanel();
    updateMemoryPanel();
}); 