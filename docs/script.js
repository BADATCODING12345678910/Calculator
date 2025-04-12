class Calculator {
    constructor() {
        this.result = document.querySelector('.result');
        this.history = document.querySelector('.history');
        this.historyContent = document.querySelector('.history-content');
        this.memoryContent = document.querySelector('.memory-content');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.memoryValue = 0;
        this.calculationHistory = [];
        this.maxDisplayLength = 16;

        this.debug = false;
        this.initializeEventListeners();
        this.initializeDisplay();
        
        window.calculatorInstance = this;
    }

    // Debug logging
    log(message, data = null) {
        if (this.debug) {
            console.log(`[Calculator] ${message}`, data || '');
        }
    }

    // Initialize display
    initializeDisplay() {
        this.updateDisplay('0');
        this.updateHistory('');
        this.updateHistoryPanel();
        this.updateMemoryPanel();
    }

    // Helper function to update display
    updateDisplay(value) {
        // Handle overflow
        if (value.toString().length > this.maxDisplayLength) {
            value = parseFloat(value).toExponential(8);
        }
        this.result.textContent = this.formatNumber(value);
        this.log('Display updated', value);
    }

    // Helper function to update history
    updateHistory(text) {
        this.history.textContent = text;
        this.log('History updated', text);
    }

    // Helper function to format number
    formatNumber(num) {
        this.log('Formatting number', num);
        const str = num.toString();
        
        // Handle scientific notation
        if (str.includes('e')) {
            const [base, exponent] = str.split('e');
            return `${this.formatNumber(base)}e${exponent}`;
        }

        // Handle decimal numbers
        const parts = str.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Limit decimal places
        if (parts[1]) {
            parts[1] = parts[1].slice(0, 8);
        }
        
        return parts.join('.');
    }

    // Calculator operations
    calculate(a, op, b) {
        this.log('Calculating', { a, op, b });
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        let result;

        switch (op) {
            case '+': result = num1 + num2; break;
            case '−': result = num1 - num2; break;
            case '×': result = num1 * num2; break;
            case '÷':
                if (num2 === 0) throw new Error('Division by zero');
                result = num1 / num2;
                break;
            case '%': result = num1 % num2; break;
            default: throw new Error('Invalid operation');
        }

        // Handle precision issues
        result = parseFloat(result.toFixed(8));
        this.log('Calculation result', result);
        return result;
    }

    // Special calculations
    calculateSpecial(value, operation) {
        this.log('Special calculation', { value, operation });
        const num = parseFloat(value);
        let result;

        switch (operation) {
            case '¹/x':
                if (num === 0) throw new Error('Division by zero');
                result = 1 / num;
                break;
            case 'x²':
                result = Math.pow(num, 2);
                break;
            case '√x':
                if (num < 0) throw new Error('Invalid input for square root');
                result = Math.sqrt(num);
                break;
            case '±':
                result = -num;
                break;
            case '%':
                result = num / 100;
                break;
            case 'C':
                result = 0;
                this.previousInput = '';
                this.operation = null;
                break;
            case 'CE':
                result = 0;
                break;
            case '⌫':
                if (this.currentInput.length > 1) {
                    result = parseFloat(this.currentInput.slice(0, -1));
                } else {
                    result = 0;
                }
                break;
            default:
                throw new Error('Invalid special operation');
        }

        // Handle precision issues
        result = parseFloat(result.toFixed(8));
        this.log('Special calculation result', result);
        return result;
    }

    // Memory operations
    memoryStore(value) {
        this.memoryValue = parseFloat(value);
        this.updateMemoryPanel();
        this.log('Memory stored', this.memoryValue);
    }

    memoryRecall() {
        this.log('Memory recalled', this.memoryValue);
        return this.memoryValue;
    }

    memoryAdd(value) {
        this.memoryValue = parseFloat((this.memoryValue + parseFloat(value)).toFixed(8));
        this.updateMemoryPanel();
        this.log('Memory added', value);
    }

    memorySubtract(value) {
        this.memoryValue = parseFloat((this.memoryValue - parseFloat(value)).toFixed(8));
        this.updateMemoryPanel();
        this.log('Memory subtracted', value);
    }

    memoryClear() {
        this.memoryValue = 0;
        this.updateMemoryPanel();
        this.log('Memory cleared');
    }

    // UI Updates
    updateHistoryPanel() {
        if (this.calculationHistory.length === 0) {
            this.historyContent.innerHTML = '<p class="no-history">There\'s no history yet.</p>';
        } else {
            this.historyContent.innerHTML = this.calculationHistory.map(calc => 
                `<div class="history-item">${calc}</div>`
            ).join('');
        }
        this.log('History panel updated');
    }

    updateMemoryPanel() {
        if (this.memoryValue === 0) {
            this.memoryContent.innerHTML = '<p class="no-memory">There\'s nothing saved in memory.</p>';
        } else {
            this.memoryContent.innerHTML = `<div class="memory-item">${this.formatNumber(this.memoryValue)}</div>`;
        }
        this.log('Memory panel updated');
    }

    // Event Listeners
    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.handleNumber(button.textContent);
            });
        });

        // Operator buttons
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperation(button.textContent);
            });
        });

        // Special function buttons
        document.querySelectorAll('.function').forEach(button => {
            button.addEventListener('click', () => {
                this.handleSpecialFunction(button.textContent);
            });
        });

        // Memory buttons
        document.querySelectorAll('.memory').forEach(button => {
            button.addEventListener('click', () => {
                this.handleMemory(button.id);
            });
        });

        // Equals button
        document.querySelector('.equals').addEventListener('click', () => {
            this.handleEquals();
        });

        // Panel tabs
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.handlePanelTab(tab);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });

        this.log('Event listeners initialized');
    }

    // Event Handlers
    handleNumber(number) {
        this.log('Number pressed', number);
        
        // Handle decimal point
        if (number === '.' && this.currentInput.includes('.')) {
            return;
        }

        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }

        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else if (this.currentInput.length < this.maxDisplayLength) {
            this.currentInput += number;
        }

        this.updateDisplay(this.currentInput);
    }

    handleOperation(op) {
        this.log('Operation pressed', op);
        if (this.currentInput === '') return;
        
        if (this.previousInput !== '') {
            this.handleEquals();
        }
        
        this.operation = op;
        this.previousInput = this.currentInput;
        this.currentInput = '';
        this.updateHistory(`${this.formatNumber(this.previousInput)} ${this.operation}`);
    }

    handleSpecialFunction(func) {
        this.log('Special function pressed', func);
        try {
            const result = this.calculateSpecial(this.currentInput, func);
            this.currentInput = result.toString();
            this.updateDisplay(this.currentInput);
        } catch (e) {
            alert(e.message);
        }
    }

    handleEquals() {
        this.log('Equals pressed');
        if (this.previousInput === '' || this.currentInput === '' || this.operation === null) return;

        try {
            const result = this.calculate(this.previousInput, this.operation, this.currentInput);
            const calculation = `${this.formatNumber(this.previousInput)} ${this.operation} ${this.formatNumber(this.currentInput)} = ${this.formatNumber(result)}`;
            this.calculationHistory.unshift(calculation);
            this.updateHistoryPanel();

            this.currentInput = result.toString();
            this.previousInput = '';
            this.operation = null;
            this.shouldResetDisplay = true;
            this.updateDisplay(this.currentInput);
            this.updateHistory('');
        } catch (e) {
            alert(e.message);
        }
    }

    handleMemory(action) {
        this.log('Memory action', action);
        try {
            switch (action) {
                case 'mc': this.memoryClear(); break;
                case 'mr': 
                    this.currentInput = this.memoryRecall().toString();
                    this.updateDisplay(this.currentInput);
                    break;
                case 'm-plus': this.memoryAdd(this.currentInput); break;
                case 'm-minus': this.memorySubtract(this.currentInput); break;
                case 'ms': this.memoryStore(this.currentInput); break;
            }
        } catch (e) {
            alert(e.message);
        }
    }

    handlePanelTab(tab) {
        this.log('Panel tab clicked', tab.textContent);
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.textContent === 'History') {
            this.historyContent.classList.remove('hidden');
            this.memoryContent.classList.add('hidden');
        } else {
            this.historyContent.classList.add('hidden');
            this.memoryContent.classList.remove('hidden');
        }
    }

    handleKeyboard(event) {
        this.log('Keyboard event', event.key);
        const key = event.key;
        
        if (/[0-9.]/.test(key)) {
            this.handleNumber(key);
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            const opMap = {
                '*': '×',
                '/': '÷',
                '-': '−'
            };
            this.handleOperation(opMap[key] || key);
        } else if (key === 'Enter' || key === '=') {
            this.handleEquals();
        } else if (key === 'Escape') {
            this.handleSpecialFunction('C');
        } else if (key === 'Backspace') {
            this.handleSpecialFunction('⌫');
        }
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
}); 