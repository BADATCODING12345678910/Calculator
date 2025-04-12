class Calculator {
    constructor() {
        // DOM elements
        this.display = document.querySelector('.current');
        this.history = document.querySelector('.history');
        
        // Initialize state
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.calculationHistory = [];
        
        // Initialize the calculator
        this.initializeDisplay();
        this.initializeEventListeners();
    }

    initializeDisplay() {
        this.updateDisplay();
        this.updateHistory();
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
    }

    updateHistory() {
        this.history.innerHTML = this.calculationHistory.join('<br>');
    }

    initializeEventListeners() {
        document.querySelectorAll('.calculator button').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                if (!action) return;

                if (!isNaN(action)) {
                    // Number buttons
                    if (this.shouldResetDisplay) {
                        this.currentInput = action;
                        this.shouldResetDisplay = false;
                    } else {
                        this.currentInput = this.currentInput === '0' ? action : this.currentInput + action;
                    }
                } else {
                    // Action buttons
                    switch (action) {
                        case 'clear':
                            this.clear();
                            break;
                        case 'decimal':
                            if (!this.currentInput.includes('.')) {
                                this.currentInput += '.';
                            }
                            break;
                        case 'sign':
                            this.currentInput = (-parseFloat(this.currentInput)).toString();
                            break;
                        case 'percent':
                            this.currentInput = (parseFloat(this.currentInput) / 100).toString();
                            break;
                        case 'add':
                        case 'subtract':
                        case 'multiply':
                        case 'divide':
                            this.handleOperation(action);
                            break;
                        case 'equals':
                            this.calculate();
                            break;
                    }
                }
                this.updateDisplay();
            });
        });
    }

    handleOperation(op) {
        if (this.operation !== null) {
            this.calculate();
        }
        this.operation = op;
        this.previousInput = this.currentInput;
        this.shouldResetDisplay = true;
    }

    calculate() {
        if (!this.operation || !this.previousInput) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        const calculation = `${prev} ${this.getOperationSymbol(this.operation)} ${current} = ${result}`;
        this.calculationHistory.push(calculation);
        
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = '';
        this.shouldResetDisplay = true;
        
        this.updateDisplay();
        this.updateHistory();
    }

    getOperationSymbol(op) {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.calculationHistory = [];
        this.updateDisplay();
        this.updateHistory();
    }
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 