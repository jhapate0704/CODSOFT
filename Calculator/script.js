document.addEventListener('DOMContentLoaded', () => {
    const keypad = document.querySelector('.keypad');
    const displayInput = document.querySelector('.display .input');
    const displayResult = document.querySelector('.display .result');
    const mainDisplay = document.querySelector('.display');

    let input = '';
    let result = '';
    let currentOperation = null;
    let previousOperand = null;
    let isResult = false;

    function clear() {
        input = '';
        result = '';
        currentOperation = null;
        previousOperand = null;
        isResult = false;
        updateDisplay();
    }
    
    // New function to remove the last character
    function backspace() {
        if (input.length > 1) {
            input = input.slice(0, -1);
        } else {
            input = '0';
        }
        updateDisplay();
    }

    function appendNumber(number) {
        if (isResult) {
            input = '';
            isResult = false;
        }
        if (number === '.' && input.includes('.')) return;
        input += number;
        updateDisplay();
    }

    function chooseOperation(operator) {
        if (input === '') return;
        if (previousOperand !== null) compute();
        currentOperation = operator;
        previousOperand = input;
        input = '';
        updateDisplay();
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(input);
        if (isNaN(prev) || isNaN(current)) return;

        switch (currentOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        result = computation;
        input = computation.toString();
        currentOperation = null;
        previousOperand = null;
        isResult = true;

        mainDisplay.classList.add('pulsing');
        setTimeout(() => mainDisplay.classList.remove('pulsing'), 1200);

        updateDisplay();
    }

    function updateDisplay() {
        displayInput.textContent = input || '0';
        if (currentOperation !== null) {
            displayResult.textContent = `${previousOperand} ${currentOperation}`;
        } else {
            displayResult.textContent = '';
        }
    }

    keypad.addEventListener('click', (e) => {
        const btn = e.target;
        if (!btn.classList.contains('btn')) return;

        const value = btn.textContent;

        if (mainDisplay.classList.contains('error')) {
            mainDisplay.classList.remove('error');
        }

        if (!isNaN(value) || value === '.') {
            appendNumber(value);
        } else if (btn.classList.contains('operator')) {
            chooseOperation(value);
        } else if (btn.classList.contains('clear')) {
            clear();
        } else if (btn.classList.contains('backspace-btn')) {
            backspace();
        } else if (btn.classList.contains('equal')) {
            compute();
        }
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key >= '0' && key <= '9' || key === '.') {
            appendNumber(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            chooseOperation(key);
        } else if (key === 'Enter' || key === '=') {
            compute();
        } else if (key === 'Backspace') {
            backspace();
        } else if (key === 'Escape') {
            clear();
        }
    });

    // Initial display update
    updateDisplay();
});   