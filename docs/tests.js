// Calculator Test Suite
class CalculatorTests {
    constructor() {
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = [];
    }

    assertEquals(expected, actual, testName) {
        this.totalTests++;
        if (expected === actual) {
            this.passedTests++;
            console.log(`✓ PASS: ${testName}`);
            return true;
        } else {
            this.failedTests.push(`${testName}: Expected ${expected}, but got ${actual}`);
            console.log(`✗ FAIL: ${testName}`);
            return false;
        }
    }

    assertClose(expected, actual, tolerance, testName) {
        this.totalTests++;
        if (Math.abs(expected - actual) <= tolerance) {
            this.passedTests++;
            console.log(`✓ PASS: ${testName}`);
            return true;
        } else {
            this.failedTests.push(`${testName}: Expected ~${expected}, but got ${actual}`);
            console.log(`✗ FAIL: ${testName}`);
            return false;
        }
    }

    runAllTests() {
        console.log('Starting Calculator Tests...');
        
        // Basic Operations
        this.testBasicOperations();
        
        // Special Functions
        this.testSpecialFunctions();
        
        // Memory Operations
        this.testMemoryOperations();
        
        // Error Handling
        this.testErrorHandling();
        
        // Number Formatting
        this.testNumberFormatting();

        // Display Results
        this.displayResults();
    }

    testBasicOperations() {
        console.log('\nTesting Basic Operations:');
        
        // Addition
        let result = calculate('123', '+', '456');
        this.assertEquals(579, result, 'Addition: 123 + 456');
        
        // Subtraction
        result = calculate('500', '−', '123');
        this.assertEquals(377, result, 'Subtraction: 500 - 123');
        
        // Multiplication
        result = calculate('12', '×', '12');
        this.assertEquals(144, result, 'Multiplication: 12 × 12');
        
        // Division
        result = calculate('100', '÷', '4');
        this.assertEquals(25, result, 'Division: 100 ÷ 4');
    }

    testSpecialFunctions() {
        console.log('\nTesting Special Functions:');
        
        // Square
        let result = calculateSpecial('16', 'x²');
        this.assertEquals(256, result, 'Square: 16²');
        
        // Square Root
        result = calculateSpecial('16', '√x');
        this.assertEquals(4, result, 'Square Root: √16');
        
        // Reciprocal
        result = calculateSpecial('4', '¹/x');
        this.assertEquals(0.25, result, 'Reciprocal: 1/4');
        
        // Percentage
        result = calculateSpecial('50', '%');
        this.assertEquals(0.5, result, 'Percentage: 50%');
        
        // Sign Change
        result = calculateSpecial('25', '±');
        this.assertEquals(-25, result, 'Sign Change: ±25');
    }

    testMemoryOperations() {
        console.log('\nTesting Memory Operations:');
        
        // Memory Store
        memoryStore(100);
        this.assertEquals(100, memoryRecall(), 'Memory Store: 100');
        
        // Memory Add
        memoryAdd(50);
        this.assertEquals(150, memoryRecall(), 'Memory Add: +50');
        
        // Memory Subtract
        memorySubtract(30);
        this.assertEquals(120, memoryRecall(), 'Memory Subtract: -30');
        
        // Memory Clear
        memoryClear();
        this.assertEquals(0, memoryRecall(), 'Memory Clear');
    }

    testErrorHandling() {
        console.log('\nTesting Error Handling:');
        
        // Division by Zero
        try {
            calculate('100', '÷', '0');
            this.failedTests.push('Division by Zero: Should throw error');
        } catch (e) {
            this.passedTests++;
            console.log('✓ PASS: Division by Zero Error');
        }
        
        // Invalid Square Root
        try {
            calculateSpecial('-16', '√x');
            this.failedTests.push('Negative Square Root: Should throw error');
        } catch (e) {
            this.passedTests++;
            console.log('✓ PASS: Negative Square Root Error');
        }
    }

    testNumberFormatting() {
        console.log('\nTesting Number Formatting:');
        
        // Integer Formatting
        this.assertEquals('1,234', formatNumber(1234), 'Format Integer: 1234');
        
        // Decimal Formatting
        this.assertEquals('1,234.56', formatNumber(1234.56), 'Format Decimal: 1234.56');
        
        // Large Number Formatting
        this.assertEquals('1,234,567', formatNumber(1234567), 'Format Large Number: 1234567');
        
        // Small Decimal Formatting
        this.assertEquals('0.12', formatNumber(0.12), 'Format Small Decimal: 0.12');
    }

    displayResults() {
        console.log('\nTest Results:');
        console.log(`Total Tests: ${this.totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.totalTests - this.passedTests}`);
        
        if (this.failedTests.length > 0) {
            console.log('\nFailed Tests:');
            this.failedTests.forEach(failure => console.log(`- ${failure}`));
        }
    }
}

// Helper functions for testing
function calculate(a, op, b) {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.calculate(a, op, b);
}

function calculateSpecial(value, operation) {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.calculateSpecial(value, operation);
}

function formatNumber(num) {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.formatNumber(num);
}

function memoryStore(value) {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.memoryStore(value);
}

function memoryRecall() {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.memoryRecall();
}

function memoryAdd(value) {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.memoryAdd(value);
}

function memorySubtract(value) {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.memorySubtract(value);
}

function memoryClear() {
    // Implementation will be provided by the main calculator
    return window.calculatorInstance.memoryClear();
} 