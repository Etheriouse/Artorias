const path = require('path');
const fs = require('fs');

const { setbackground } = require('./window')
var cache = require('./cache.json');
const {config} = require('./config')

const cache_cleared = {
    "tools": {
        "clipboard": {
            "refresh_interval": "0"
        },
        "calendar": {
            "time-travel": 0
        },
        "markdown": {
            "input": ""
        }
    },
    "menu": {
        "games": true
    }
}

/**
 * Put assignate inside the folder path
 * @param {*} path 
 * @param {*} assignate 
 */
async function putincache(path, assignate) {
    const path_ = path.split('/');
    let value = cache;
    let fvalue
    let fkey
    path_.forEach(key => {
        if (!(key in value)) {
            value[key] = {};
        }
        fvalue = value;
        fkey = key;
        value = value[key];
    });
    fvalue[fkey] = assignate;
}

/**
 * Get the value of the folder put in setting
 * @param {*} path 
 * @returns the value of the folder searched
 */
async function getcache(path) {
    const path_ = path.split('/');
    let value = cache;
    path_.forEach(key => {
        value = value[key];
    });
    return value;
}

function changetheme(theme) {
    config.colortheme = theme;
    return {ok: true};
}

async function clearcache() {
   cache = cache_cleared;
   return {ok: true}
}

/**
 * Save the cache folder in ./cache.json file
 */
async function savecache() {
    try {
        fs.writeFileSync(path.join(__dirname, './cache.json'), JSON.stringify(cache));
    } catch (err) {
        console.error("Error when save cache ", err);
    }
}

function getcolortheme() {
    return path.join(__dirname, `./data/color/${config.colortheme}.css`);
}

module.exports = { putincache, getcache, clearcache, savecache, getcolortheme, changetheme };
