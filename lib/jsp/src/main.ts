class number_ {

    size: number;
    bits: bit[];

    constructor(size: number, value?: string) {
        this.size = size;
        this.bits = [];
        let i = 0;
        if (value) {
            let len: number = size - value.length;
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

    add(n: number_): number_ {
        let tmp;
        var new_n: number_ = new number_(n.size);
        var carry_: bit = new bit(0);
        for (let i = 0; i < this.size; i++) {
            tmp = this.bits[i].add(n.bits[i], carry_);
            new_n.bits[i] = tmp.value;
            carry_ = tmp.carry;
        }
        return new_n;
    }

    sub(n: number_): number_ {
        let tmp;
        var new_n: number_ = new number_(n.size);
        var carry_: bit = new bit(0);
        for (let i = 0; i < this.size; i++) {
            tmp = this.bits[i].add(n.bits[i], carry_);
            new_n.bits[i] = tmp.value;
            carry_ = tmp.carry;
        }
        return new_n;
    }

    toString(): string {
        let txt: string = 'Size: ' + this.size + '\nBits: ';
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
    value: boolean;

    constructor(value: number | boolean) {
        if (typeof value === 'boolean') {
            this.value = value;
        } else {
            this.value = value === 1;
        }
    }

    copy() {
        return new bit(this.value);
    }

    and(b: bit) {
        this.value = b.value && this.value;
        return this;
    }
    or(b: bit) {
        this.value = b.value || this.value;
        return this;
    }
    xor(b: bit) {
        this.value = b.value !== this.value;
        return this;
    }
    not() {
        this.value = !this.value;
        return this;
    }

    add(b: bit, c: bit) {
        let tmp: bit = this.copy().xor(b);
        return { value: tmp.copy().xor(c), carry: this.copy().and(b).or(tmp.and(c)) };
    }

    toString(): string {
        return this.value ? '1' : '0';
    }
}

function and(a: boolean, b: boolean) {
    return a && b;
}

function or(a: boolean, b: boolean) {
    return a || b;
}

function xor(a: boolean, b: boolean) {
    return a !== b;
}


function add_1b(a: boolean, b: boolean, c: boolean) {
    let tmp = xor(a, b);
    return { value: xor(c, tmp), carry: or(and(a, b), and(tmp, c)) };
}

const a: number_ = new number_(8, "1111");
const b: number_ = new number_(8, "100");

console.log(a.toString());
console.log(b.toString());

console.log(a.add(b).toString());