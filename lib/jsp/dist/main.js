"use strict";
class number_ {
    constructor(size, value) {
        this.size = size;
        this.bits = [];
        let i = 0;
        if (value) {
            let len = size - value.length;
            for (let i = value.length - 1; i >= 0; i--) {
                this.bits.push(new bit(parseInt(value.charAt(i))));
            }
            while (i < len) {
                this.bits.push(new bit(0));
                i++;
            }
            /*
                algorithmique et fondement theorique 10.99
                lf 13.83
                log 11.125
                mag 13
                malg 6.75
                programation system 12.665
                opc: 14.75
                syre: 9.636
                ilm: 13.844
                ingenelogie logiciel 11.358
                prav: 11.925
                bmo: 7
                cmpl: 14.475
                prgc: 10.8
                connaissance transversal

                esec: 15.5
                ang: 3.563
                moneur douverture ou d'approfondissement 12.385
                fun: 6.3
                secu: 16.036

            */
        }
    }
    add(n) {
        let tmp;
        var new_n = new number_(n.size);
        var carry_ = new bit(0);
        for (let i = 0; i < this.size; i++) {
            tmp = this.bits[i].add(n.bits[i], carry_);
            new_n.bits[i] = tmp.value;
            carry_ = tmp.carry;
        }
        return new_n;
    }
    toString() {
        let txt = 'Size: ' + this.size + '\nBits: ';
        for (let i = this.size - 1; i >= 0; i--) {
            txt += this.bits[i].toString();
            if ((i + 1) % 8 == 0) {
                txt += ' ';
            }
        }
        return txt;
    }
}
class bit {
    constructor(value) {
        if (typeof value === 'boolean') {
            this.value = value;
        }
        else {
            this.value = value === 1;
        }
    }
    copy() {
        return new bit(this.value);
    }
    and(b) {
        this.value = b.value && this.value;
        return this;
    }
    or(b) {
        this.value = b.value || this.value;
        return this;
    }
    xor(b) {
        this.value = b.value !== this.value;
        return this;
    }
    not() {
        this.value = !this.value;
        return this;
    }
    add(b, c) {
        let tmp = this.copy().xor(b);
        return { value: tmp.copy().xor(c), carry: this.copy().and(b).or(tmp.and(c)) };
    }
    toString() {
        return this.value ? '1' : '0';
    }
}
function and(a, b) {
    return a && b;
}
function or(a, b) {
    return a || b;
}
function xor(a, b) {
    return a !== b;
}
function add_1b(a, b, c) {
    let tmp = xor(a, b);
    return { value: xor(c, tmp), carry: or(and(a, b), and(tmp, c)) };
}
const a = new number_(8, "1111");
const b = new number_(8, "100");
console.log(a.toString());
console.log(b.toString());
console.log(a.add(b).toString());
