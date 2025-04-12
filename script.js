const calculator = {
    currentValue: '0',
    previousValue: '',
    operator: null,
    shouldResetDisplay: false,
    history: [],

    display: document.querySelector('.current'),
    historyDisplay: document.querySelector('.history'),

    initialize() {
        this.updateDisplay();
    },

    updateDisplay() {
        // Format large numbers with commas
        let displayValue = this.currentValue;
        if (!isNaN(displayValue) && displayValue !== '') {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1000) {
                displayValue = num.toLocaleString('en-US');
            }
        }
        this.display.textContent = displayValue;
        this.historyDisplay.innerHTML = this.history.join('<br>');
    },

    handleNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        this.updateDisplay();
    },

    handleDecimal() {
        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
            this.updateDisplay();
        }
    },

    handleOperator(op) {
        if (this.operator !== null) {
            this.calculate();
        }
        this.operator = op;
        this.previousValue = this.currentValue;
        this.shouldResetDisplay = true;
    },

    handleBackspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    },

    handleSign() {
        if (this.currentValue !== '0' && this.currentValue !== 'Error') {
            this.currentValue = (-parseFloat(this.currentValue)).toString();
            this.updateDisplay();
        }
    },

    handlePercent() {
        if (this.currentValue !== 'Error') {
            this.currentValue = (parseFloat(this.currentValue) / 100).toString();
            this.updateDisplay();
        }
    },

    handleSquare() {
        if (this.currentValue !== 'Error') {
            const num = parseFloat(this.currentValue);
            const result = num * num;
            this.history.push(`sqr(${this.currentValue}) = ${result}`);
            this.currentValue = result.toString();
            this.updateDisplay();
        }
    },

    handleSquareRoot() {
        if (this.currentValue !== 'Error') {
            const num = parseFloat(this.currentValue);
            if (num < 0) {
                this.currentValue = 'Error';
            } else {
                const result = Math.sqrt(num);
                this.history.push(`√(${this.currentValue}) = ${result}`);
                this.currentValue = result.toString();
            }
            this.updateDisplay();
        }
    },

    handleReciprocal() {
        if (this.currentValue !== 'Error' && this.currentValue !== '0') {
            const num = parseFloat(this.currentValue);
            const result = 1 / num;
            this.history.push(`1/(${this.currentValue}) = ${result}`);
            this.currentValue = result.toString();
            this.updateDisplay();
        } else if (this.currentValue === '0') {
            this.currentValue = 'Error';
            this.updateDisplay();
        }
    },

    calculate() {
        if (!this.operator || !this.previousValue) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operator) {
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
                    this.currentValue = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format the result
        result = Math.round(result * 1000000) / 1000000;

        // Add to history
        const calculation = `${prev} ${this.operator} ${current} = ${result}`;
        this.history.push(calculation);

        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    },

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = [];
        this.updateDisplay();
    }
};

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    calculator.initialize();
}); 