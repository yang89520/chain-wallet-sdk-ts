const BigNumber = require('BigNumber.js');

export function numberToHex(value: any) {
    const number = BigNumber(value);
    const result = number.toString(16);
    return '0x' + result;
}