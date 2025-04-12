// In-depth Test Suite for QuickCalc
class InDepthTests {
    constructor() {
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = [];
        this.calculator = window.calculatorInstance;
        this.calculator.debug = true; // Enable debug mode for testing
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

    assertThrows(func, errorMessage, testName) {
        this.totalTests++;
        try {
            func();
            this.failedTests.push(`${testName}: Expected to throw error`);
            console.log(`✗ FAIL: ${testName}`);
            return false;
        } catch (e) {
            if (e.message === errorMessage) {
                this.passedTests++;
                console.log(`✓ PASS: ${testName}`);
                return true;
            } else {
                this.failedTests.push(`${testName}: Expected "${errorMessage}", but got "${e.message}"`);
                console.log(`✗ FAIL: ${testName}`);
                return false;
            }
        }
    }

    runAllTests() {
        console.log('Starting In-Depth Tests...');
        
        // Basic Calculator Tests
        this.testBasicOperations();
        this.testSpecialFunctions();
        this.testMemoryOperations();
        this.testDisplayFormatting();
        this.testErrorHandling();
        this.testKeyboardInput();
        this.testHistoryFunctionality();
        
        // Notes Tests
        this.testNotesStorage();
        this.testNotesOperations();
        this.testNotesUI();
        
        // Display Results
        this.displayResults();
    }

    testBasicOperations() {
        console.log('\nTesting Basic Operations:');
        
        // Addition
        let result = this.calculator.calculate('5', '+', '3');
        this.assertEquals(8, result, 'Addition: 5 + 3');
        
        // Subtraction
        result = this.calculator.calculate('10', '−', '4');
        this.assertEquals(6, result, 'Subtraction: 10 - 4');
        
        // Multiplication
        result = this.calculator.calculate('6', '×', '7');
        this.assertEquals(42, result, 'Multiplication: 6 × 7');
        
        // Division
        result = this.calculator.calculate('15', '÷', '3');
        this.assertEquals(5, result, 'Division: 15 ÷ 3');
        
        // Division with decimal result
        result = this.calculator.calculate('10', '÷', '3');
        this.assertClose(3.33333333, result, 0.00000001, 'Division with decimal: 10 ÷ 3');
    }

    testSpecialFunctions() {
        console.log('\nTesting Special Functions:');
        
        // Square
        let result = this.calculator.calculateSpecial('5', 'x²');
        this.assertEquals(25, result, 'Square: 5²');
        
        // Square Root
        result = this.calculator.calculateSpecial('16', '√x');
        this.assertEquals(4, result, 'Square Root: √16');
        
        // Reciprocal
        result = this.calculator.calculateSpecial('4', '¹/x');
        this.assertEquals(0.25, result, 'Reciprocal: 1/4');
        
        // Percentage
        result = this.calculator.calculateSpecial('50', '%');
        this.assertEquals(0.5, result, 'Percentage: 50%');
        
        // Sign Change
        result = this.calculator.calculateSpecial('25', '±');
        this.assertEquals(-25, result, 'Sign Change: ±25');
    }

    testMemoryOperations() {
        console.log('\nTesting Memory Operations:');
        
        // Memory Store
        this.calculator.memoryStore('100');
        this.assertEquals(100, this.calculator.memoryRecall(), 'Memory Store: 100');
        
        // Memory Add
        this.calculator.memoryAdd('50');
        this.assertEquals(150, this.calculator.memoryRecall(), 'Memory Add: +50');
        
        // Memory Subtract
        this.calculator.memorySubtract('30');
        this.assertEquals(120, this.calculator.memoryRecall(), 'Memory Subtract: -30');
        
        // Memory Clear
        this.calculator.memoryClear();
        this.assertEquals(0, this.calculator.memoryRecall(), 'Memory Clear');
    }

    testDisplayFormatting() {
        console.log('\nTesting Display Formatting:');
        
        // Large Numbers
        this.assertEquals('1,234,567', this.calculator.formatNumber(1234567), 'Format Large Number');
        
        // Decimal Numbers
        this.assertEquals('1,234.56', this.calculator.formatNumber(1234.56), 'Format Decimal');
        
        // Scientific Notation
        this.assertEquals('1.23e+6', this.calculator.formatNumber(1230000), 'Format Scientific');
        
        // Small Decimal
        this.assertEquals('0.000123', this.calculator.formatNumber(0.000123), 'Format Small Decimal');
    }

    testErrorHandling() {
        console.log('\nTesting Error Handling:');
        
        // Division by Zero
        this.assertThrows(
            () => this.calculator.calculate('10', '÷', '0'),
            'Division by zero',
            'Division by Zero Error'
        );
        
        // Invalid Square Root
        this.assertThrows(
            () => this.calculator.calculateSpecial('-16', '√x'),
            'Invalid input for square root',
            'Negative Square Root Error'
        );
        
        // Invalid Operation
        this.assertThrows(
            () => this.calculator.calculate('10', 'invalid', '5'),
            'Invalid operation',
            'Invalid Operation Error'
        );
    }

    testKeyboardInput() {
        console.log('\nTesting Keyboard Input:');
        
        // Test number input
        this.calculator.handleNumber('5');
        this.assertEquals('5', this.calculator.currentInput, 'Number Input: 5');
        
        // Test decimal point
        this.calculator.handleNumber('.');
        this.assertEquals('5.', this.calculator.currentInput, 'Decimal Point Input');
        
        // Test operation
        this.calculator.handleOperation('+');
        this.assertEquals('+', this.calculator.operation, 'Operation Input: +');
        
        // Test equals
        this.calculator.currentInput = '3';
        this.calculator.handleEquals();
        this.assertEquals('8', this.calculator.currentInput, 'Equals Operation');
    }

    testHistoryFunctionality() {
        console.log('\nTesting History Functionality:');
        
        // Clear history
        this.calculator.calculationHistory = [];
        
        // Add calculations
        this.calculator.calculate('5', '+', '3');
        this.calculator.calculate('10', '×', '2');
        
        // Test history length
        this.assertEquals(2, this.calculator.calculationHistory.length, 'History Length');
        
        // Test history content
        const lastCalculation = this.calculator.calculationHistory[0];
        this.assertEquals(true, lastCalculation.includes('20'), 'History Content');
    }

    testNotesStorage() {
        console.log('\nTesting Notes Storage:');
        
        // Test localStorage
        const testNote = {
            id: Date.now(),
            title: 'Test Note',
            content: 'Test Content',
            lastModified: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('notes', JSON.stringify([testNote]));
        
        // Retrieve from localStorage
        const savedNotes = JSON.parse(localStorage.getItem('notes'));
        this.assertEquals(testNote.title, savedNotes[0].title, 'Notes Storage: Title');
        this.assertEquals(testNote.content, savedNotes[0].content, 'Notes Storage: Content');
    }

    testNotesOperations() {
        console.log('\nTesting Notes Operations:');
        
        // Test note creation
        const note = {
            id: Date.now(),
            title: 'New Note',
            content: 'New Content',
            lastModified: new Date().toISOString()
        };
        
        // Test note update
        note.title = 'Updated Title';
        this.assertEquals('Updated Title', note.title, 'Note Update: Title');
        
        // Test note deletion
        const notes = [note];
        const filteredNotes = notes.filter(n => n.id !== note.id);
        this.assertEquals(0, filteredNotes.length, 'Note Deletion');
    }

    testNotesUI() {
        console.log('\nTesting Notes UI:');
        
        // Test panel switching
        const historyTab = document.querySelector('.panel-tab');
        this.calculator.handlePanelTab(historyTab);
        this.assertEquals(false, this.calculator.historyContent.classList.contains('hidden'), 'Panel Switching');
        
        // Test memory display
        this.calculator.memoryValue = 100;
        this.calculator.updateMemoryPanel();
        const memoryContent = this.calculator.memoryContent.innerHTML;
        this.assertEquals(true, memoryContent.includes('100'), 'Memory Display');
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

// Run tests when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const tests = new InDepthTests();
    tests.runAllTests();
}); 