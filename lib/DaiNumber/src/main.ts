export class DaiNumber {
    digits: string[];

    constructor(digits_?: string) { // a modifier prend la string et chaque char devient un tab de char pour le nombre etc
        this.digits = digits_ ?? [];
    }

    toString() {
        let text: string = '';
        if(this.digits) {
            this.digits.forEach(digit => {
                text += digit;
            });
        }
        return text;
    }
}