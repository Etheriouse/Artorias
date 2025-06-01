"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaiNumber = void 0;
class DaiNumber {
    constructor(digits_) {
        this.digits = digits_ !== null && digits_ !== void 0 ? digits_ : [];
    }
    toString() {
        let text = '';
        if (this.digits) {
            this.digits.forEach(digit => {
                text += digit;
            });
        }
        return text;
    }
}
exports.DaiNumber = DaiNumber;
