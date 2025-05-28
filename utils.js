const path = require('path');
const fs = require('fs');

var cache = require('./cache.json');

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

/**
 * Clear the content of the folder put in setting
 * @param {*} path 
 */
async function clearcache(path) {
    const path_ = path.split('/');
    let value = cache;
    let fvalue
    let fkey
    path_.forEach(key => {
        fvalue = value;
        fkey = key;
        value = value[key];
    });
    fvalue[fkey] = {};
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

module.exports = { putincache, getcache, clearcache, savecache };