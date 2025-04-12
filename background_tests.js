// Background Testing and Debug System
class BackgroundMonitor {
    constructor() {
        this.errors = [];
        this.logs = [];
        this.setupErrorHandling();
        this.setupPerformanceMonitoring();
    }

    // Setup global error handling
    setupErrorHandling() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.logError({
                message: msg,
                location: `${url}:${lineNo}:${columnNo}`,
                stack: error?.stack,
                timestamp: new Date().toISOString()
            });
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                message: event.reason,
                type: 'Promise Rejection',
                timestamp: new Date().toISOString()
            });
        });
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor calculator operations
        const originalHandleNumber = calculator.handleNumber;
        calculator.handleNumber = (...args) => {
            const start = performance.now();
            const result = originalHandleNumber.apply(calculator, args);
            const duration = performance.now() - start;
            
            if (duration > 16.67) { // More than one frame (60fps)
                this.log('Performance warning: Number input took ' + duration.toFixed(2) + 'ms', 'warn');
            }
            
            return result;
        };

        // Monitor calculations
        const originalCalculate = calculator.calculate;
        calculator.calculate = (...args) => {
            const start = performance.now();
            const result = originalCalculate.apply(calculator, args);
            const duration = performance.now() - start;
            
            if (duration > 16.67) {
                this.log('Performance warning: Calculation took ' + duration.toFixed(2) + 'ms', 'warn');
            }
            
            return result;
        };
    }

    // Log error with timestamp
    logError(error) {
        this.errors.push(error);
        console.error(
            `%c[${error.timestamp}] Error: ${error.message}`,
            'color: #ff0000'
        );
        if (error.stack) {
            console.error(error.stack);
        }
    }

    // Log message with level
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = { message, level, timestamp };
        this.logs.push(logEntry);
        
        const colors = {
            error: '#ff0000',
            warn: '#ffa500',
            info: '#00ff00',
            debug: '#888888'
        };
        
        console.log(
            `%c[${timestamp}] ${level.toUpperCase()}: ${message}`,
            `color: ${colors[level]}`
        );
    }

    // Basic sanity checks
    runSanityChecks() {
        try {
            // Check basic arithmetic
            calculator.clear();
            calculator.handleNumber('2');
            calculator.handleOperator('+');
            calculator.handleNumber('2');
            calculator.calculate();
            if (calculator.currentValue !== '4') {
                this.log('Basic arithmetic check failed', 'error');
            }

            // Check memory functions
            calculator.clear();
            calculator.handleNumber('5');
            calculator.handleMemoryStore();
            calculator.clear();
            calculator.handleMemoryRecall();
            if (calculator.currentValue !== '5') {
                this.log('Memory function check failed', 'error');
            }

            // Check clear function
            calculator.clear();
            if (calculator.currentValue !== '0') {
                this.log('Clear function check failed', 'error');
            }

        } catch (error) {
            this.logError({
                message: 'Sanity check failed',
                error: error,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Initialize background monitoring
const monitor = new BackgroundMonitor();

// Run initial sanity checks after a short delay
setTimeout(() => {
    monitor.runSanityChecks();
}, 1000);

// Run periodic checks every 5 minutes
setInterval(() => {
    monitor.runSanityChecks();
}, 300000); 