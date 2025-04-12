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
            buttons: new Set(),
            events: new Set()
        };
        this.stressTestResults = [];
        this.regressionResults = [];
        this.visualResults = [];
    }

    // Enable detailed logging for debugging with log levels
    enableDebugMode(level = 'info') {
        this.debugMode = true;
        this.logLevel = level; // 'error', 'warn', 'info', 'debug'
        this.log('Debug mode enabled with level: ' + level, 'info');
    }

    // Enhanced logging with levels and colors
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const colors = {
            error: '#ff0000',
            warn: '#ffa500',
            info: '#00ff00',
            debug: '#888888'
        };
        
        const logEntry = {
            timestamp,
            level,
            message,
            stackTrace: level === 'error' ? new Error().stack : null
        };
        
        this.testLogs.push(logEntry);
        
        if (this.debugMode && this.shouldLog(level)) {
            console.log(
                `%c[${timestamp}] ${level.toUpperCase()}: ${message}`,
                `color: ${colors[level]}`
            );
            if (level === 'error') {
                console.trace();
            }
        }
    }

    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        return levels.indexOf(level) <= levels.indexOf(this.logLevel);
    }

    // Enhanced performance measurement with memory usage
    measurePerformance(testName, callback) {
        const startMemory = window.performance.memory?.usedJSHeapSize;
        const start = performance.now();
        
        try {
            callback();
        } catch (error) {
            this.log(`Error in ${testName}: ${error.message}`, 'error');
            throw error;
        }
        
        const end = performance.now();
        const endMemory = window.performance.memory?.usedJSHeapSize;
        
        this.performanceMetrics[testName] = {
            executionTime: end - start,
            memoryUsage: endMemory ? endMemory - startMemory : 'Not available',
            timestamp: new Date().toISOString()
        };
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

    // Visual regression testing
    async testVisualRegression() {
        this.setUp();
        const testCases = [
            { action: () => calculator.handleNumber('123'), name: 'Basic number input' },
            { action: () => calculator.handleOperator('+'), name: 'Operator display' },
            { action: () => calculator.calculate(), name: 'Calculation result' },
            { action: () => calculator.handleError('Test error'), name: 'Error display' }
        ];

        for (const testCase of testCases) {
            testCase.action();
            const display = calculator.display.textContent;
            const style = window.getComputedStyle(calculator.display);
            
            this.visualResults.push({
                name: testCase.name,
                display,
                fontSize: style.fontSize,
                color: style.color,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Stress testing
    async performStressTest() {
        this.setUp();
        const operations = [
            () => calculator.handleNumber(Math.floor(Math.random() * 10).toString()),
            () => calculator.handleOperator(['+', '−', '×', '÷'][Math.floor(Math.random() * 4)]),
            () => calculator.calculate(),
            () => calculator.clear()
        ];

        const startTime = performance.now();
        let operationCount = 0;
        
        while (performance.now() - startTime < 1000) { // 1 second of stress testing
            const operation = operations[Math.floor(Math.random() * operations.length)];
            try {
                operation();
                operationCount++;
            } catch (error) {
                this.log(`Stress test error at operation ${operationCount}: ${error.message}`, 'error');
                break;
            }
        }

        this.stressTestResults.push({
            operationsPerSecond: operationCount,
            timestamp: new Date().toISOString(),
            errors: this.failedTests.length
        });
    }

    // Test event handling
    testEventHandling() {
        this.setUp();
        const events = [
            { type: 'click', target: 'button', expected: true },
            { type: 'keydown', key: 'Enter', expected: true },
            { type: 'keydown', key: 'Escape', expected: true },
            { type: 'paste', data: '123', expected: false }
        ];

        events.forEach(event => {
            try {
                let handled = false;
                if (event.type === 'click') {
                    const button = document.querySelector('button');
                    handled = button.dispatchEvent(new MouseEvent('click'));
                } else if (event.type === 'keydown') {
                    handled = document.dispatchEvent(new KeyboardEvent('keydown', { key: event.key }));
                } else if (event.type === 'paste') {
                    handled = document.dispatchEvent(new ClipboardEvent('paste', { 
                        clipboardData: new DataTransfer()
                    }));
                }
                
                this.assert(
                    handled === event.expected,
                    `Event handling: ${event.type} ${event.key || ''}`
                );
                this.coverage.events.add(event.type);
            } catch (error) {
                this.log(`Event test error: ${error.message}`, 'error');
            }
        });
    }

    // Test accessibility
    testAccessibility() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            this.assert(
                button.getAttribute('role') === 'button' || button.tagName === 'BUTTON',
                `Button role: ${button.textContent}`
            );
            this.assert(
                window.getComputedStyle(button).color !== window.getComputedStyle(button).backgroundColor,
                `Button contrast: ${button.textContent}`
            );
        });
    }

    // Generate enhanced coverage report
    generateCoverageReport() {
        const baseReport = super.generateCoverageReport();
        const totalEvents = ['click', 'keydown', 'keyup', 'paste'].length;
        
        return {
            ...baseReport,
            eventCoverage: (this.coverage.events.size / totalEvents) * 100,
            timestamp: new Date().toISOString(),
            details: {
                coveredFunctions: Array.from(this.coverage.functions),
                coveredOperations: Array.from(this.coverage.operations),
                coveredEvents: Array.from(this.coverage.events)
            }
        };
    }

    // Enhanced test results display with interactive features
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
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            min-width: 80vw;
        `;

        const content = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h2 style="color: #00ff00; margin-bottom: 20px;">Enhanced Test Results</h2>
                <div>
                    <button onclick="document.querySelector('.test-content').style.display='block'; document.querySelector('.visual-content').style.display='none';" style="margin: 0 5px;">Tests</button>
                    <button onclick="document.querySelector('.test-content').style.display='none'; document.querySelector('.visual-content').style.display='block';" style="margin: 0 5px;">Visual Tests</button>
                </div>
            </div>

            <div class="test-content">
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
                    <div>Event Coverage: ${coverage.eventCoverage.toFixed(2)}%</div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #00ff00;">Performance Metrics</h3>
                    ${Object.entries(this.performanceMetrics)
                        .map(([test, data]) => `
                            <div>
                                ${test}:
                                <span style="color: #888">Time: ${data.executionTime.toFixed(2)}ms</span>
                                ${data.memoryUsage !== 'Not available' ? 
                                    `<span style="color: #888"> | Memory: ${(data.memoryUsage / 1024 / 1024).toFixed(2)}MB</span>` : 
                                    ''}
                            </div>
                        `).join('')}
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #00ff00;">Stress Test Results</h3>
                    ${this.stressTestResults.map(result => `
                        <div>Operations/sec: ${result.operationsPerSecond}</div>
                        <div>Errors: ${result.errors}</div>
                    `).join('')}
                </div>

                ${this.failedTests.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #ff0000;">Failed Tests</h3>
                        ${this.failedTests.map(test => `<div>❌ ${test}</div>`).join('')}
                    </div>
                ` : ''}

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #00ff00;">Debug Log</h3>
                    <select onchange="document.querySelectorAll('.log-entry').forEach(e => e.style.display = this.value === 'all' || e.dataset.level === this.value ? 'block' : 'none')" style="margin-bottom: 10px; background: #333; color: white; border: 1px solid #666; padding: 5px;">
                        <option value="all">All Levels</option>
                        <option value="error">Errors Only</option>
                        <option value="warn">Warnings+</option>
                        <option value="info">Info+</option>
                        <option value="debug">Debug</option>
                    </select>
                    <div style="max-height: 200px; overflow-y: auto; padding: 10px; background: rgba(0,0,0,0.3);">
                        ${this.testLogs.map(log => `
                            <div class="log-entry" data-level="${log.level}" style="color: ${
                                log.level === 'error' ? '#ff0000' :
                                log.level === 'warn' ? '#ffa500' :
                                log.level === 'info' ? '#00ff00' : '#888888'
                            }">
                                [${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}
                                ${log.stackTrace ? `<pre style="font-size: 12px; margin-left: 20px; color: #666">${log.stackTrace}</pre>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="visual-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #00ff00;">Visual Regression Results</h3>
                    ${this.visualResults.map(result => `
                        <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                            <div>Test: ${result.name}</div>
                            <div>Display: <span style="font-family: ${result.fontFamily}; font-size: ${result.fontSize}; color: ${result.color}">${result.display}</span></div>
                            <div>Style: ${result.fontSize}, ${result.color}</div>
                            <div>Timestamp: ${result.timestamp}</div>
                        </div>
                    `).join('')}
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

    // Run enhanced test suite with all new features
    async runEnhancedTests() {
        this.enableDebugMode('debug');
        this.log('Starting enhanced test suite...', 'info');

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
            'testDisplayConsistency',
            'testEventHandling',
            'testAccessibility'
        ];

        try {
            for (const testName of tests) {
                this.log(`Running ${testName}...`, 'info');
                await this.measurePerformance(testName, async () => {
                    await this[testName]();
                });
            }

            this.log('Running stress test...', 'info');
            await this.performStressTest();

            this.log('Running visual regression tests...', 'info');
            await this.testVisualRegression();

        } catch (error) {
            this.log(`Test suite error: ${error.message}`, 'error');
        }

        this.log('Test suite completed', 'info');
        this.displayTestResults();
    }
} 