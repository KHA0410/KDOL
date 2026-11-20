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

function attachDialog(state) {
    const trigger = { isConnected: true, focused: false, focus() { this.focused = true; } };
    const dialog = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
    state.$refs = { calculatorDialog: dialog, calculatorTrigger: trigger, calculatorScreen: { focus() {} } };
    state.$nextTick = fn => fn();
    return { trigger, dialog };
}

test('calculator totals prices and follows multiplication/division precedence in expressions', () => {
    const { state, press } = calculator();
    assert.equal(press('209000*12+300000='), '2808000');
    assert.equal(state.formatCalculatorNumber(state.calculatorEntry), '2.808.000');
    press(['clear']);
    assert.equal(press('2+3*4='), '14');
});

test('typing 12+12-2 preserves the whole expression until equals is pressed', () => {
    const { state, press } = calculator();
    press('12+12');
    assert.equal(state.calculatorDisplay(), '12 + 12');
    assert.equal(state.calculatorExpression, '');
    press('-');
    assert.equal(state.calculatorDisplay(), '12 + 12 −');
    assert.equal(state.calculatorEntry, '12');
    press('2');
    assert.equal(state.calculatorDisplay(), '12 + 12 − 2');
    assert.equal(state.calculatorExpression, '');
    assert.equal(press('='), '22');
    assert.equal(state.calculatorDisplay(), '22');
    assert.equal(state.calculatorExpression, '12 + 12 − 2 =');
});

test('mixed expressions can continue across many operations without early calculation', () => {
    const { state, press } = calculator();
    press('12+12-2*3/2+5');
    assert.equal(state.calculatorDisplay(), '12 + 12 − 2 × 3 ÷ 2 + 5');
    assert.equal(press('='), '26');
    press(['clear']);
    press('1/0+3');
    assert.equal(state.calculatorError, '');
    assert.equal(state.calculatorDisplay(), '1 ÷ 0 + 3');
    press('=');
    assert.equal(state.calculatorError, 'Không thể chia cho 0');
});

test('Backspace edits numbers and operators throughout a pending expression', () => {
    const { state, press } = calculator();
    press('12+34-');
    press(['backspace']);
    assert.equal(state.calculatorDisplay(), '12 + 34');
    press(['backspace']);
    assert.equal(state.calculatorDisplay(), '12 + 3');
    press(['backspace']);
    assert.equal(state.calculatorDisplay(), '12 +');
    press(['backspace']);
    assert.equal(state.calculatorDisplay(), '12');
    assert.equal(press('-2='), '10');
});

test('equals waits for a missing operand and changing an operator preserves earlier terms', () => {
    const { state, press } = calculator();
    press('12+');
    press('=');
    assert.equal(state.calculatorDisplay(), '12 +');
    assert.equal(state.calculatorExpression, '');
    assert.equal(press('2='), '14');
    press(['clear']);
    press('12+12-*2');
    assert.equal(state.calculatorDisplay(), '12 + 12 × 2');
    assert.equal(press('='), '36');
});

test('percentage expressions stay visible and support continuing or undoing the percentage', () => {
    const { state, press } = calculator();
    press('200000-10%');
    assert.equal(state.calculatorDisplay(), '200.000 − 10%');
    assert.equal(press('+30000='), '210000');
    press(['clear']);
    assert.equal(press('200+100+10%='), '330');
    press(['clear']);
    assert.equal(press('200+100*10%='), '210');
    press(['clear']);
    press('200-10%');
    press(['backspace']);
    assert.equal(state.calculatorDisplay(), '200 − 10');
    assert.equal(press('='), '190');
});

test('a shortened prefilled price supports a complete expression before calculating', () => {
    const { state, press } = calculator();
    attachDialog(state);
    state.openCalculatorFromPrice(209000, {});
    press('+12-2');
    assert.equal(state.calculatorDisplay(), '209 + 12 − 2');
    assert.equal(press('='), '219');
    assert.equal(state.calculatorInThousands, true);
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
    assert.equal(state.calculatorTokens.length, 0);
    assert.equal(state.calculatorPercentInput, null);
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

test('selecting prices reveals one shortcut without opening the calculator; outside clicks dismiss it', () => {
    const { state } = calculator();
    const { dialog } = attachDialog(state);
    const first = {}, second = {};
    state.selectCalculatorPrice(first);
    assert.equal(state.activeCalculatorPrice, first);
    assert.equal(dialog.open, false);
    state.selectCalculatorPrice(first);
    assert.equal(state.activeCalculatorPrice, null);
    assert.equal(dialog.open, false);
    state.selectCalculatorPrice(first);
    assert.equal(state.activeCalculatorPrice, first);
    state.selectCalculatorPrice(second);
    assert.equal(state.activeCalculatorPrice, second);
    state.selectCalculatorPrice(second);
    assert.equal(state.activeCalculatorPrice, null);
    state.selectCalculatorPrice(second);
    state.dismissCalculatorPrice();
    assert.equal(state.activeCalculatorPrice, null);
});

test('a price shortcut clears previous calculation and errors, then is ready for VAT or new digits', () => {
    const { state, press } = calculator();
    const { dialog } = attachDialog(state);
    press('3/0=');
    state.openCalculatorFromPrice(200000, {});
    assert.equal(dialog.open, true);
    assert.equal(state.calculatorError, '');
    assert.equal(state.calculatorExpression, '');
    assert.equal(state.calculatorEntry, '200');
    assert.equal(state.calculatorInThousands, true);
    assert.equal(press('+8%='), '216');
    state.openCalculatorFromPrice(209000, {});
    assert.equal(press('*12='), '2508');
    state.openCalculatorFromPrice(209000, {});
    assert.equal(press('7'), '7');
});

test('prefilled prices match displayed rounding and current Internet period and setup fees', () => {
    const { state } = calculator();
    attachDialog(state);
    state.openCalculatorFromPrice(1000.6, {});
    assert.equal(state.calculatorEntry, '1001');
    state.internetMonths = 12;
    state.includeInternetSetupFee = true;
    state.includeInternetCameraSetupFee = false;
    state.openCalculatorFromPrice(state.calculateInternetTotal(209000), {});
    assert.equal(state.calculatorEntry, '2808');
    assert.equal(state.calculatorInThousands, true);
    state.internetMonths = 3;
    state.includeInternetSetupFee = false;
    state.openCalculatorFromPrice(state.calculateInternetTotal(209000), {});
    assert.equal(state.calculatorEntry, '627');
});

test('price shortcuts remove exactly three trailing zeroes and retain fractional results in thousands', () => {
    const { state, press } = calculator();
    attachDialog(state);
    state.openCalculatorFromPrice(1250000, {});
    assert.equal(state.calculatorEntry, '1250');
    assert.equal(state.formatCalculatorNumber(state.calculatorEntry), '1.250');
    assert.equal(state.calculatorInThousands, true);
    assert.equal(press('/3='), '416.666666666667');
    state.openCalculatorFromPrice(1000000, {});
    assert.equal(state.calculatorEntry, '1000');
    state.openCalculatorFromPrice(-200000, {});
    assert.equal(state.calculatorEntry, '-200');
});

test('prices without three trailing zeroes keep their full amount and reset the previous unit', () => {
    const { state, press } = calculator();
    attachDialog(state);
    state.openCalculatorFromPrice(200000, {});
    press(['clear']);
    assert.equal(state.calculatorInThousands, true);
    for (const value of [209500, 982, 1001, 0]) {
        state.openCalculatorFromPrice(value, {});
        assert.equal(state.calculatorEntry, String(value));
        assert.equal(state.calculatorInThousands, false);
    }
    state.openCalculatorFromPrice(200000, {});
    assert.equal(press('5'), '5');
    assert.equal(state.calculatorInThousands, true);
});

test('unknown prices cannot open the calculator; zero is a valid price', () => {
    const { state } = calculator();
    const { dialog } = attachDialog(state);
    for (const value of [null, undefined, NaN, Infinity, '200000', Number.MAX_SAFE_INTEGER + 1]) {
        state.openCalculatorFromPrice(value, {});
        assert.equal(dialog.open, false);
    }
    state.openCalculatorFromPrice(0, {});
    assert.equal(dialog.open, true);
    assert.equal(state.calculatorEntry, '0');
});

test('closing a price calculation restores focus to the price, or the header when its row was removed', () => {
    const { state } = calculator();
    const { trigger } = attachDialog(state);
    const price = { isConnected: true, focused: false, focus() { this.focused = true; } };
    state.openCalculatorFromPrice(200000, price);
    state.closeCalculator();
    assert.equal(price.focused, true);
    assert.equal(trigger.focused, false);
    state.openCalculatorFromPrice(200000, price);
    price.isConnected = false;
    state.closeCalculator();
    assert.equal(trigger.focused, true);
});
