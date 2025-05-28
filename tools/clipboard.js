const { clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const { config } = require('../config');


var history = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/clipboard/history.json')));
var last_clip_text;

var history_loaded = false;

function backup_clipboard() {
    const clip_text = clipboard.readText();

    if (clip_text && clip_text !== last_clip_text.content) {
        last_clip_text.content = clip_text;
        history.push({ date: new Date().toString(), content: clip_text, type: 'text' });
    }
}

function saveClipboardHistory() {
    fs.writeFileSync(path.join(__dirname, '../data/clipboard/history.json'), JSON.stringify(history));
}

function runClipboard() {
    history = history.filter(element => {
        return Math.abs(new Date(element.date) - new Date()) < 1000 * config.tools.clipboard.time_ago_s;
    });


    if (history.length == 0) {
        last_clip_text = { content: "" };
    } else {
        last_clip_text = history[history.length - 1];
    }
    history_loaded = true;
    setInterval(backup_clipboard, config.tools.clipboard.speed_clippaper_analyse);
}

function set(text) {
    clipboard.writeText(unescapeHTML(text));
}

function delete_(date) {
    date.forEach(element => {
        const index = history.findIndex(item => item.date === element);
        if (index !== -1) {
            history.splice(index, 1);
        }
    })
}

function unescapeHTML(html) {
    return html
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}

const History = () => history;

module.exports = { History, runClipboard, backup_clipboard, saveClipboardHistory, set, delete_ };