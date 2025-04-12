document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;

    // Helper function to update display
    const updateDisplay = (value) => {
        display.value = value;
    };

    // Helper function to handle number input
    const handleNumber = (number) => {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        currentInput += number;
        updateDisplay(currentInput);
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
            default:
                return;
        }

        currentInput = result.toString();
        previousInput = '';
        operation = null;
        shouldResetDisplay = true;
        updateDisplay(currentInput);
    };

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
            } else if (button.classList.contains('clear')) {
                currentInput = '';
                previousInput = '';
                operation = null;
                updateDisplay('');
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
        else if (['+', '-', '*', '/'].includes(key)) {
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
        }
    });
}); 