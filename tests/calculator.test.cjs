const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing } = require('./helpers/pricing.cjs');

function calculator() {
    const { state } = loadPricing();
    const press = sequence => {
        for (const key of sequence) state.calculatorPress(key);
        return state.calculatorEntry;
    };
    return { state, press };
}

test('calculator totals prices and follows pocket-calculator order for chained operations', () => {
    const { state, press } = calculator();
    assert.equal(press('209000*12+300000='), '2808000');
    assert.equal(state.formatCalculatorNumber(state.calculatorEntry), '2.808.000');
    press(['clear']);
    assert.equal(press('2+3*4='), '20');
});

test('calculator applies percentage discounts and VAT relative to the current price', () => {
    const { press } = calculator();
    assert.equal(press('200000-10%='), '180000');
    press(['clear']);
    assert.equal(press('200000+8%='), '216000');
    press(['clear']);
    assert.equal(press('200000*10%='), '20000');
    press(['clear']);
    assert.equal(press('50%'), '0.5');
});

test('calculator retains decimal input and removes floating-point noise', () => {
    const { state, press } = calculator();
    press('12.50');
    assert.equal(state.formatCalculatorNumber(state.calculatorEntry), '12,50');
    press(['clear']);
    assert.equal(press('0.1+0.2='), '0.3');
    press(['clear']);
    press('1/10000000=');
    assert.equal(state.formatCalculatorNumber(state.calculatorEntry), '0,0000001');
    press(['negate']);
    assert.equal(state.formatCalculatorNumber(state.calculatorEntry), '-0,0000001');
    press(['clear']);
    press('1/3000000=*2=');
    assert.ok(!state.calculatorExpression.includes('e-'));
    assert.ok(state.calculatorExpression.startsWith('0,000000333333333333333 × 2 ='));
});

test('calculator supports correction, negative numbers, and changing a pending operator', () => {
    const { press } = calculator();
    press('123');
    assert.equal(press(['backspace']), '12');
    press(['clear', 'negate', '.', '5']);
    assert.equal(press('*2='), '-1');
    press(['clear']);
    assert.equal(press('100+*3='), '300');
    press(['clear', '1', 'backspace', 'backspace']);
    assert.equal(press('2'), '2');
});

test('calculator continues from a result or starts fresh when typing a new number', () => {
    const { state, press } = calculator();
    assert.equal(press('200+50='), '250');
    assert.equal(press('*2='), '500');
    assert.equal(press('7'), '7');
    assert.equal(state.calculatorExpression, '');
    assert.equal(press('+3=='), '10');
});

test('division by zero reports an error and the next number starts a fresh calculation', () => {
    const { state, press } = calculator();
    press('123/0=');
    assert.equal(state.calculatorError, 'Không thể chia cho 0');
    assert.equal(press('25+5='), '30');
    assert.equal(state.calculatorError, '');
});

test('calculator rejects unsafe amounts and limits entered digits', () => {
    const { state, press } = calculator();
    press('9999999999999999');
    assert.equal(state.calculatorEntry, '999999999999999');
    press('*999=');
    assert.equal(state.calculatorError, 'Số quá lớn');
    press(['clear']);
    assert.equal(state.calculatorError, '');
    assert.equal(state.calculatorAccumulator, null);
    assert.equal(state.calculatorOperator, null);
    assert.equal(state.calculatorEntry, '0');
});

test('keyboard supports decimal comma, Enter and deletion while preserving navigation and shortcuts', () => {
    const { state } = calculator();
    const closeButton = {};
    state.$refs = { calculatorDialog: { querySelector: () => closeButton } };
    const key = (value, extra = {}) => {
        let prevented = false;
        state.handleCalculatorKey({ key: value, preventDefault() { prevented = true; }, ...extra });
        return prevented;
    };
    for (const value of ['2', ',', '5', 'x', '2', 'Enter']) assert.equal(key(value), true);
    assert.equal(state.calculatorEntry, '5');
    key('Delete');
    key('9');
    key('Backspace');
    assert.equal(state.calculatorEntry, '0');
    for (const value of ['Tab', 'Escape', 'a']) assert.equal(key(value), false);
    assert.equal(key('2', { ctrlKey: true }), false);
    assert.equal(key('Enter', { target: closeButton }), false);
});

test('calculator dialog restores focus, preserves values on reopen and closes only outside its bounds', () => {
    const { state, press } = calculator();
    let triggerFocused = false, screenFocused = false;
    const dialog = {
        open: false,
        showModal() { this.open = true; },
        close() { this.open = false; },
        getBoundingClientRect() { return { left: 100, right: 400, top: 100, bottom: 600 }; }
    };
    state.$refs = {
        calculatorDialog: dialog,
        calculatorTrigger: { focus() { triggerFocused = true; } },
        calculatorScreen: { focus() { screenFocused = true; } }
    };
    state.$nextTick = fn => fn();
    press('200000-10%=');
    state.openCalculator();
    assert.equal(dialog.open, true);
    assert.equal(screenFocused, true);
    state.handleCalculatorBackdrop({ target: dialog, clientX: 150, clientY: 200 });
    assert.equal(dialog.open, true);
    state.handleCalculatorBackdrop({ target: {}, clientX: 0, clientY: 0 });
    assert.equal(dialog.open, true);
    state.handleCalculatorBackdrop({ target: dialog, clientX: 10, clientY: 20 });
    assert.equal(dialog.open, false);
    assert.equal(triggerFocused, true);
    state.openCalculator();
    assert.equal(state.calculatorEntry, '180000');
});
