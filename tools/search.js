const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const bdd = require('../data/search/bdd.json');

const ext = [
    'txt', 'md', 'rtf', 'csv', 'tsv', 'log', 'ini', 'conf', 'cfg',

    'js', 'mjs', 'cjs', 'ts', 'html', 'htm', 'css', 'scss', 'sass', 'less',
    'json', 'yaml', 'yml', 'xml', 'php', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
    'sh', 'bash', 'bat', 'ps1', 'go', 'rs', 'swift', 'kt', 'kts', 'lua', 'rb',
    'pl', 'sql', 'asm', 'r', 'rmd',

    'toml', 'env', 'make', 'gradle',
    'gitignore', 'gitattributes', 'yarnrc', 'npmrc',
    'babelrc', 'eslintrc', 'prettierrc', 'dockerfile',

    'tex', 'rst', 'adoc',

    'jsonl', 'ndjson', 'arff', 'dat', 'data'
];


const filesInRead = []

function getIDF(word) {
    return Math.log(bdd.files.length / (1 + bdd.words[word].df))
}

function scoreTfIdf(words) {
    const files = {}
    words.forEach(word => {
        word = word.toLowerCase();
        for (const hash in bdd.words[word]) {
            if (!(hash === 'df')) {
                if (!files[hash]) {
                    files[hash] = { score: bdd.words[word][hash].tf * getIDF(word), filename: bdd.words[word][hash].file };
                } else {
                    files[hash].score += bdd.words[word][hash].tf * getIDF(word);
                }
            }
        }
    })
    return files;
}

function fillBdd(path_) {
    function fetchFiles(dirPath) {
        const files = fs.readdirSync(dirPath, { withFileTypes: true })

        files.forEach(async (file) => {
            const fullPath = path.join(dirPath, file.name);

            if (file.isDirectory()) {
                fetchFiles(fullPath);
            } else {
                if (!file.name.includes('bdd.json')) {
                    const f = file.name.split('.');
                    if (ext.includes(f[f.length - 1])) {
                        addFileToBdd(fullPath);
                    }
                }
            }
        });
    }
    try {
        fetchFiles(path_);
        saveBdd();
        return { ok: true }
    } catch(err) {
        console.log(err);
        console.log(bdd.length)
        return {ok: false}
    }
}

/*
{
    "length": 0,
    "files": [
    ],
    "words": {}
}
*/

function addFileToBdd(file) {
    const hash = hash_(file);
    let maj = bdd.files.includes(hash);
    if (maj) {
        majFileToBdd(file, hash);
    } else {
        const content = fs.readFileSync(file, 'utf-8');
        bdd.files.push(hash);
        try {
            const arr = content.match(/\b\w+\b/g);
            if(arr) {
                arr.forEach(word => {
                    word = word.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
                    if (!bdd.words[word]) {
                        bdd.words[word] = { df: 0 };
                    }
                    if (!bdd.words[word][hash]) {
                        bdd.words[word].df++;
                        bdd.words[word][hash] = { file: file, tf: 1 };
                    } else {
                        bdd.words[word][hash].tf++;
                    }
                    bdd.length++;
                })
            }
        } catch (err) {
            console.error("Error during match", err);
        }
    }
}

function hash_(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

async function majFileToBdd(file, hash) {

}

function saveBdd() {
    fs.writeFileSync('data/search/bdd.json', JSON.stringify(bdd));
}

function clearBdd() {
    fs.writeFileSync('data/search/bdd.json', JSON.stringify({
        length: 0,
        files: [],
        words: {}
    }));
    bdd.length = 0;
    bdd.files = [];
    bdd.words = {}
    return {ok: true}
}

function searchinindexbase(search) {

    const result = scoreTfIdf(search.split(' '));
    const arr = [];
    for (const id in result) {
        arr.push({ file: result[id].filename, s: result[id].score });
    }

    arr.sort(((a, b) => b.s - a.s));
    return arr.slice(0, 100);
}


module.exports = { searchinindexbase, addFileToBdd, scoreTfIdf, fillBdd, clearBdd }