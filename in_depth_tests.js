// In-depth Test Suite for QuickCalc
class InDepthTests {
    constructor() {
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = [];
    }

    assert(condition, message) {
        this.totalTests++;
        if (condition) {
            this.passedTests++;
            console.log(`✓ Test passed: ${message}`);
        } else {
            this.failedTests.push(message);
            console.error(`✗ Test failed: ${message}`);
        }
    }

    setUp() {
        calculator.clear();
    }

    // Test basic number input and display
    testNumberInput() {
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleNumber('2');
        calculator.handleNumber('3');
        this.assert(calculator.currentValue === '123', 'Number input sequence');
        
        this.setUp();
        calculator.handleNumber('0');
        calculator.handleNumber('5');
        this.assert(calculator.currentValue === '5', 'Leading zero handling');
    }

    // Test decimal handling
    testDecimal() {
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleDecimal();
        calculator.handleNumber('5');
        this.assert(calculator.currentValue === '1.5', 'Decimal point handling');
        
        calculator.handleDecimal();
        this.assert(calculator.currentValue === '1.5', 'Multiple decimal prevention');
    }

    // Test basic operations
    testBasicOperations() {
        // Addition
        this.setUp();
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        calculator.calculate();
        this.assert(calculator.currentValue === '8', 'Basic addition');

        // Subtraction
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleNumber('0');
        calculator.handleOperator('−');
        calculator.handleNumber('4');
        calculator.calculate();
        this.assert(calculator.currentValue === '6', 'Basic subtraction');

        // Multiplication
        this.setUp();
        calculator.handleNumber('6');
        calculator.handleOperator('×');
        calculator.handleNumber('7');
        calculator.calculate();
        this.assert(calculator.currentValue === '42', 'Basic multiplication');

        // Division
        this.setUp();
        calculator.handleNumber('2');
        calculator.handleNumber('0');
        calculator.handleOperator('÷');
        calculator.handleNumber('5');
        calculator.calculate();
        this.assert(calculator.currentValue === '4', 'Basic division');
    }

    // Test special functions
    testSpecialFunctions() {
        // Square
        this.setUp();
        calculator.handleNumber('4');
        calculator.handleSquare();
        this.assert(calculator.currentValue === '16', 'Square function');

        // Square root
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleNumber('6');
        calculator.handleSquareRoot();
        this.assert(calculator.currentValue === '4', 'Square root function');

        // Reciprocal
        this.setUp();
        calculator.handleNumber('4');
        calculator.handleReciprocal();
        this.assert(calculator.currentValue === '0.25', 'Reciprocal function');

        // Percentage
        this.setUp();
        calculator.handleNumber('5');
        calculator.handleNumber('0');
        calculator.handlePercent();
        this.assert(calculator.currentValue === '0.5', 'Percentage function');

        // Sign change
        this.setUp();
        calculator.handleNumber('5');
        calculator.handleSign();
        this.assert(calculator.currentValue === '-5', 'Sign change function');
    }

    // Test error handling
    testErrorHandling() {
        // Division by zero
        this.setUp();
        calculator.handleNumber('5');
        calculator.handleOperator('÷');
        calculator.handleNumber('0');
        calculator.calculate();
        this.assert(calculator.currentValue === 'Error', 'Division by zero error');

        // Square root of negative
        this.setUp();
        calculator.handleNumber('9');
        calculator.handleSign();
        calculator.handleSquareRoot();
        this.assert(calculator.currentValue === 'Error', 'Square root of negative error');

        // Reciprocal of zero
        this.setUp();
        calculator.handleNumber('0');
        calculator.handleReciprocal();
        this.assert(calculator.currentValue === 'Error', 'Reciprocal of zero error');
    }

    // Test display formatting
    testDisplayFormatting() {
        // Large numbers
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleNumber('2');
        calculator.handleNumber('3');
        calculator.handleNumber('4');
        calculator.handleNumber('5');
        calculator.handleNumber('6');
        this.assert(calculator.display.textContent === '123,456', 'Large number formatting');

        // Decimal numbers
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleNumber('2');
        calculator.handleDecimal();
        calculator.handleNumber('3');
        calculator.handleNumber('4');
        this.assert(calculator.currentValue === '12.34', 'Decimal number formatting');
    }

    // Test backspace functionality
    testBackspace() {
        this.setUp();
        calculator.handleNumber('1');
        calculator.handleNumber('2');
        calculator.handleNumber('3');
        calculator.handleBackspace();
        this.assert(calculator.currentValue === '12', 'Backspace function');
        
        calculator.handleBackspace();
        calculator.handleBackspace();
        this.assert(calculator.currentValue === '0', 'Backspace to zero');
    }

    // Test history functionality
    testHistory() {
        this.setUp();
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        calculator.calculate();
        this.assert(calculator.history.length === 1, 'History recording');
        this.assert(calculator.history[0] === '5 + 3 = 8', 'History format');
    }

    // Run all tests
    runAllTests() {
        console.log('Starting calculator tests...');
        
        try {
            this.testNumberInput();
            this.testDecimal();
            this.testBasicOperations();
            this.testSpecialFunctions();
            this.testErrorHandling();
            this.testDisplayFormatting();
            this.testBackspace();
            this.testHistory();

            console.log('\nTest Summary:');
            console.log(`Total tests: ${this.totalTests}`);
            console.log(`Passed: ${this.passedTests}`);
            console.log(`Failed: ${this.totalTests - this.passedTests}`);
            
            if (this.failedTests.length > 0) {
                console.log('\nFailed Tests:');
                this.failedTests.forEach(test => console.log(`- ${test}`));
            }

            // Remove any existing test results
            const existingResults = document.querySelector('.test-results');
            if (existingResults) {
                existingResults.remove();
            }

            // Create a visual display of test results on the page
            const testResults = document.createElement('div');
            testResults.className = 'test-results';
            testResults.style.position = 'fixed';
            testResults.style.top = '10px';
            testResults.style.right = '10px';
            testResults.style.background = this.failedTests.length > 0 ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 128, 0, 0.9)';
            testResults.style.padding = '15px';
            testResults.style.borderRadius = '5px';
            testResults.style.color = 'white';
            testResults.style.fontFamily = 'monospace';
            testResults.style.zIndex = '1000';
            testResults.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            testResults.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 10px;">Test Results</div>
                Total: ${this.totalTests}<br>
                Passed: ${this.passedTests}<br>
                Failed: ${this.totalTests - this.passedTests}
                ${this.failedTests.length > 0 ? 
                    `<div style="margin-top: 10px; color: #ff9999;">Failed Tests:<br>` + 
                    this.failedTests.map(test => `- ${test}`).join('<br>') + 
                    '</div>' : 
                    '<div style="margin-top: 10px; color: #99ff99;">All tests passed! ✓</div>'}
            `;
            document.body.appendChild(testResults);
            
            // Remove the test results after 10 seconds
            setTimeout(() => {
                testResults.style.transition = 'opacity 0.5s';
                testResults.style.opacity = '0';
                setTimeout(() => testResults.remove(), 500);
            }, 10000);

        } catch (error) {
            console.error('Test execution failed:', error);
            alert('Test execution failed. Check console for details.');
        }
    }
}

// Remove auto-run on load since we have a button now 