// Enhanced Test Suite for QuickCalc
class EnhancedTests extends InDepthTests {
    constructor() {
        super();
        this.debugMode = false;
        this.testLogs = [];
        this.performanceMetrics = {};
        this.coverage = {
            functions: new Set(),
            operations: new Set(),
            buttons: new Set()
        };
    }

    // Enable detailed logging for debugging
    enableDebugMode() {
        this.debugMode = true;
        console.log('Debug mode enabled');
    }

    // Log test execution with timestamps
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}`;
        this.testLogs.push(logEntry);
        if (this.debugMode) {
            console.log(logEntry);
        }
    }

    // Measure function execution time
    measurePerformance(testName, callback) {
        const start = performance.now();
        callback();
        const end = performance.now();
        this.performanceMetrics[testName] = end - start;
    }

    // Test keyboard input handling
    testKeyboardInput() {
        this.setUp();
        const keyEvents = [
            { key: '1', expected: '1' },
            { key: '+', expected: '1' },
            { key: '2', expected: '2' },
            { key: 'Enter', expected: '3' }
        ];

        keyEvents.forEach(event => {
            const keyEvent = new KeyboardEvent('keydown', { key: event.key });
            document.dispatchEvent(keyEvent);
            this.assert(
                calculator.currentValue === event.expected,
                `Keyboard input: ${event.key}`
            );
        });
    }

    // Test memory operations
    testMemoryOperations() {
        this.setUp();
        
        // Test MS (Memory Store)
        calculator.handleNumber('5');
        calculator.handleMemoryStore();
        this.assert(calculator.memory === 5, 'Memory Store');

        // Test MR (Memory Recall)
        calculator.clear();
        calculator.handleMemoryRecall();
        this.assert(calculator.currentValue === '5', 'Memory Recall');

        // Test M+ (Memory Add)
        calculator.handleNumber('3');
        calculator.handleMemoryAdd();
        calculator.handleMemoryRecall();
        this.assert(calculator.currentValue === '8', 'Memory Add');

        // Test M- (Memory Subtract)
        calculator.handleNumber('2');
        calculator.handleMemorySubtract();
        calculator.handleMemoryRecall();
        this.assert(calculator.currentValue === '6', 'Memory Subtract');

        // Test MC (Memory Clear)
        calculator.handleMemoryClear();
        calculator.handleMemoryRecall();
        this.assert(calculator.currentValue === '0', 'Memory Clear');
    }

    // Test calculator state persistence
    testStatePersistence() {
        this.setUp();
        
        // Set some values
        calculator.handleNumber('5');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        
        // Save state
        const savedState = {
            currentValue: calculator.currentValue,
            previousValue: calculator.previousValue,
            operator: calculator.operator,
            memory: calculator.memory
        };
        
        // Clear and verify state is different
        calculator.clear();
        this.assert(calculator.currentValue !== savedState.currentValue, 'State cleared');
        
        // Restore state
        calculator.currentValue = savedState.currentValue;
        calculator.previousValue = savedState.previousValue;
        calculator.operator = savedState.operator;
        calculator.memory = savedState.memory;
        
        // Verify state restored
        this.assert(
            calculator.currentValue === savedState.currentValue &&
            calculator.previousValue === savedState.previousValue &&
            calculator.operator === savedState.operator,
            'State persistence'
        );
    }

    // Test edge cases
    testEdgeCases() {
        this.setUp();
        
        // Test very large numbers
        calculator.handleNumber('9'.repeat(16));
        this.assert(calculator.currentValue.includes('e'), 'Large number scientific notation');
        
        // Test very small numbers
        calculator.clear();
        calculator.handleNumber('0');
        calculator.handleDecimal();
        calculator.handleNumber('0'.repeat(15));
        calculator.handleNumber('1');
        this.assert(calculator.currentValue.includes('e-'), 'Small number scientific notation');
        
        // Test multiple operations
        calculator.clear();
        calculator.handleNumber('2');
        calculator.handleOperator('+');
        calculator.handleNumber('3');
        calculator.handleOperator('×');
        calculator.handleNumber('4');
        calculator.calculate();
        this.assert(calculator.currentValue === '20', 'Multiple operations');
    }

    // Test display update consistency
    testDisplayConsistency() {
        this.setUp();
        const testCases = [
            { input: '1234567890', expected: '1,234,567,890' },
            { input: '-1234.5678', expected: '-1,234.5678' },
            { input: '0.0001', expected: '0.0001' },
            { input: '1000000000000000', expected: '1e+15' }
        ];

        testCases.forEach(({ input, expected }) => {
            calculator.clear();
            input.split('').forEach(char => {
                if (char === '-') {
                    calculator.handleSign();
                } else if (char === '.') {
                    calculator.handleDecimal();
                } else {
                    calculator.handleNumber(char);
                }
            });
            this.assert(
                calculator.display.textContent === expected,
                `Display formatting: ${input} → ${expected}`
            );
        });
    }

    // Generate coverage report
    generateCoverageReport() {
        const totalFunctions = Object.getOwnPropertyNames(Calculator.prototype).length;
        const totalOperations = ['+', '−', '×', '÷', 'sqrt', 'square', '%'].length;
        const totalButtons = document.querySelectorAll('button').length;

        return {
            functionCoverage: (this.coverage.functions.size / totalFunctions) * 100,
            operationCoverage: (this.coverage.operations.size / totalOperations) * 100,
            buttonCoverage: (this.coverage.buttons.size / totalButtons) * 100
        };
    }

    // Enhanced test results display
    displayTestResults() {
        const coverage = this.generateCoverageReport();
        const testResults = document.createElement('div');
        testResults.className = 'enhanced-test-results';
        testResults.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            padding: 20px;
            border-radius: 10px;
            color: white;
            font-family: monospace;
            z-index: 1000;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            min-width: 60vw;
        `;

        const content = `
            <h2 style="color: #00ff00; margin-bottom: 20px;">Enhanced Test Results</h2>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00;">Test Summary</h3>
                <div>Total Tests: ${this.totalTests}</div>
                <div>Passed: ${this.passedTests}</div>
                <div>Failed: ${this.totalTests - this.passedTests}</div>
                <div>Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%</div>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00;">Coverage Report</h3>
                <div>Function Coverage: ${coverage.functionCoverage.toFixed(2)}%</div>
                <div>Operation Coverage: ${coverage.operationCoverage.toFixed(2)}%</div>
                <div>Button Coverage: ${coverage.buttonCoverage.toFixed(2)}%</div>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00;">Performance Metrics</h3>
                ${Object.entries(this.performanceMetrics)
                    .map(([test, time]) => `<div>${test}: ${time.toFixed(2)}ms</div>`)
                    .join('')}
            </div>

            ${this.failedTests.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #ff0000;">Failed Tests</h3>
                    ${this.failedTests.map(test => `<div>❌ ${test}</div>`).join('')}
                </div>
            ` : ''}

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00;">Debug Log</h3>
                <div style="max-height: 200px; overflow-y: auto; padding: 10px; background: rgba(0,0,0,0.3);">
                    ${this.testLogs.map(log => `<div>${log}</div>`).join('')}
                </div>
            </div>

            <button onclick="this.parentElement.remove()" style="
                background: #00ff00;
                color: black;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Close Results</button>
        `;

        testResults.innerHTML = content;
        document.body.appendChild(testResults);
    }

    // Run enhanced test suite
    runEnhancedTests() {
        this.enableDebugMode();
        this.log('Starting enhanced test suite...');

        const tests = [
            'testNumberInput',
            'testDecimal',
            'testBasicOperations',
            'testSpecialFunctions',
            'testErrorHandling',
            'testDisplayFormatting',
            'testBackspace',
            'testHistory',
            'testKeyboardInput',
            'testMemoryOperations',
            'testStatePersistence',
            'testEdgeCases',
            'testDisplayConsistency'
        ];

        tests.forEach(testName => {
            this.log(`Running ${testName}...`);
            this.measurePerformance(testName, () => {
                this[testName]();
            });
        });

        this.log('Test suite completed');
        this.displayTestResults();
    }
} 