const types = require('../data/converter/type.json');
const Decimal = require('decimal.js');

const special = ['quantity', 'states', 'electricity']
const special_calcule = ['money', 'date', 'angle', 'temperature']

const pi = '3.14159265358979323846264338327950288419716939937510582';

function possiblefor(type_) {
    if (special.includes(type_)) {
        return { ok: false };
    }
    const possible = types[type_].possible;
    const options = [];

    for (const acro in possible) {
        options.push({ value: acro, text: possible[acro] });
    }
    return options;
}

function convert(section, fromType, value, toType) {
    value = (String(value)).replace(',', '.');
    if (value === '-') {
        value = '';
    }
    if (!value) {
        return { ok: true, value: 'empty' };
    }
    if (special_calcule.includes(section)) {
        return special_convert(section, fromType, value, toType);
    }
    const convert = types[section].convert;
    try {
        let value_ = new Decimal(value);
        let from = new Decimal(convert[fromType])
        let to = new Decimal(convert[toType])
        return { ok: true, value: (value_.mul(from)).div(to).toString() };
    } catch (err) {
        return { ok: false };
    }
}

function special_convert(section, fromType, value, toType) {
    let value_ = new Decimal(value);
    switch (section) {
        case 'temperature':
            return { ok: true, value: celcius_to(to_celcius(fromType, value_), toType).toString() };

        case 'angle':
            return { ok: true, value: switch_angle_format(fromType, value_, toType).toString() };

        case 'date':
            return { ok: true };

        case 'money':
            return { ok: true };
    }
    return { ok: false };
}

function to_celcius(from, value) {
    switch (from) {
        case 'K':
            return value.sub(new Decimal(273.15));
        case 'F':
            return value.sub(new Decimal(32)).div(new Decimal(1.8))
        case 'C':
            return value;
    }
}

function celcius_to(value, to) {
    switch (to) {
        case 'K':
            return value.plus(new Decimal(273.15));
        case 'F':
            return value.mul(new Decimal(1.8)).plus(new Decimal(32));
        case 'C':
            return value;
    }
}

function switch_angle_format(from, value, to) {
    switch (from) {
        case 'deg':
            switch (to) {
                case 'deg':
                    return value;
                default:
                    return value.mul(new Decimal(pi).div(new Decimal(180)));
            }
        case 'rad':
            switch (to) {
                case 'deg':
                    return value.mul(new Decimal(180).div(new Decimal(pi)));
                default:
                    return value;
            }
    }
}

/*

convert => par rapport a la mesure "neutre" celle a taille humaine

1 mm = 1m * 0.001
1 km = 1m * 1000

donc pour convertir 1 mm en km on fait

(value * convert[mm]) / convert[km]
( on divise pour inverser la convertion )

{
"convert": {
"mm": 0.001
"km": 1000
}
}
*/

module.exports = { possiblefor, convert }