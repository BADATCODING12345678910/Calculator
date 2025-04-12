// Quick test of calculator functionality
console.log('Running Quick Calculator Tests...');

// Enable debug mode
window.calculatorInstance.debug = true;

// Test basic operations
console.log('\nTesting Basic Operations:');

// Test 1: Addition
const addResult = window.calculatorInstance.calculate('5', '+', '3');
console.log(`5 + 3 = ${addResult} (Expected: 8)`);

// Test 2: Multiplication
const multResult = window.calculatorInstance.calculate('4', '×', '6');
console.log(`4 × 6 = ${multResult} (Expected: 24)`);

// Test 3: Special Function (Square)
const squareResult = window.calculatorInstance.calculateSpecial('5', 'x²');
console.log(`5² = ${squareResult} (Expected: 25)`);

// Test 4: Memory Operations
console.log('\nTesting Memory Operations:');
window.calculatorInstance.memoryStore('10');
console.log(`Memory Store: ${window.calculatorInstance.memoryRecall()} (Expected: 10)`);

window.calculatorInstance.memoryAdd('5');
console.log(`Memory Add: ${window.calculatorInstance.memoryRecall()} (Expected: 15)`);

// Test 5: Number Formatting
console.log('\nTesting Number Formatting:');
const formatted = window.calculatorInstance.formatNumber(1234.56);
console.log(`Format 1234.56: ${formatted} (Expected: 1,234.56)`);

// Summary
console.log('\nTest Summary:');
console.log('1. Addition: ' + (addResult === 8 ? '✓ PASS' : '✗ FAIL'));
console.log('2. Multiplication: ' + (multResult === 24 ? '✓ PASS' : '✗ FAIL'));
console.log('3. Square: ' + (squareResult === 25 ? '✓ PASS' : '✗ FAIL'));
console.log('4. Memory Store: ' + (window.calculatorInstance.memoryRecall() === 15 ? '✓ PASS' : '✗ FAIL'));
console.log('5. Number Formatting: ' + (formatted === '1,234.56' ? '✓ PASS' : '✗ FAIL')); 