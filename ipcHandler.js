const password_ = require('./tools/password');
const clipboard_ = require('./tools/clipboard');
const converter_ = require('./tools/converter');
const calendar_ = require('./tools/calendar');
const observe_ = require('./tools/observer')
const search_ = require('./tools/search')
const utils = require('./utils');
const path = require('path');
const fs = require('fs');

const { closeWindow, loadfile, openFile, saveFile } = require('./window');
const { ipcMain, shell } = require('electron');

function Handler() {

    /* --------------------- Window --------------------- */

    ipcMain.handle('load-page', async (event, namemenu) => {
        loadfile(namemenu);
    })

    ipcMain.handle('open-file', async (event, extention) => {
        return await openFile(extention);
    })

    ipcMain.handle('save-file', async (event, content, extention) => {
        return await saveFile(content, extention);
    })

    /* -------------------- Password -------------------- */

    ipcMain.handle('load-pwds', async (event) => {
        return await password_.loadpsds();
    })

    ipcMain.handle('get-objectpwd', (event) => {
        return password_.getobjectpsd();
    })

    ipcMain.handle('password-modify', async (event, psd_id) => {
        password_.modifywindow(psd_id);
    })

    ipcMain.handle('password-add', async (event) => {
        return await password_.addwindow();
    })

    ipcMain.handle('save-psd', async (event, psd_obj) => {
        return await password_.savepsd(psd_obj);
    })

    ipcMain.handle('close-window', async (event) => {
        closeWindow();
    })

    ipcMain.handle('admin-password', async (event) => {
        return password_.adminPassword()
    })

    ipcMain.handle('confirmed-password', async (event, gived_psd) => {
        return await password_.confirmedAdminPassword(gived_psd);
    })

    ipcMain.handle('decrypt-password', async (event, psd) => {
        return await password_.decrypt_(psd);
    })

    ipcMain.handle('register-password', async (event, psd_object) => {
        return await password_.encrypt_(psd_object);
    })

    ipcMain.handle('delete-password', async (event, psd_to_delete) => {
        return await password_.delete_(psd_to_delete);
    })


    /* --------------------- Shell ---------------------- */

    ipcMain.handle('open-website', (event, url) => {
        shell.openExternal(url);
    })

    ipcMain.handle('open-folder', (event, path_) => {
        if (path_.dirname) {
            shell.openPath(path.join(__dirname, path_.path));
        } else {
            shell.openPath(path.join(path_.path));
        }
    })


    /* -------------------- Clipboard ------------------- */

    ipcMain.handle('get-history-paper', async (event) => {
        return clipboard_.History();
    })

    ipcMain.handle('set-to-paper', (event, text) => {
        clipboard_.set(text);
    })

    ipcMain.handle('delete-to-history', (event, date) => {
        return clipboard_.delete_(date);
    })

    /* -------------------- Convertor ------------------- */

    ipcMain.handle('get-possible-type-for', async (event, type) => {
        return converter_.possiblefor(type);
    })

    ipcMain.handle('from-convert-to', async (event, section, fromType, value, toType) => {
        return converter_.convert(section, fromType, value, toType);
    })

    /* ---------------------- Calendar ------------------ */

    ipcMain.handle('register-event', async (event, when) => {
        calendar_.registerevent(when);
    })

    ipcMain.handle('add-event', async (event, event_) => {
        return calendar_.addeventwindow(event_);
    })

    ipcMain.handle('confirm-event', async (event, slot) => {
        calendar_.confirmaddevent(slot);
    })

    ipcMain.handle('get-event', async (event) => {
        return calendar_.getevent_();
    })

    ipcMain.handle('get-event-day', async (event, year, month, day) => {
        return calendar_.geteventday(year, month, day);
    })

    ipcMain.handle('modify-event', async (event, event_) => {
        return await calendar_.modifyeventwindow(event_);
    })

    ipcMain.handle('confirm-modify-event', (event, event_) => {
        return calendar_.confirmmodifyevent(event_);
    })

    ipcMain.handle('delete-event', async (event, event_) => {
        return await calendar_.deleteevent(event_);
    })

    ipcMain.handle('get-person', async () => {
        return await calendar_.getperson();
    })

    ipcMain.handle('get-by-uid-person', (event) => {
        return calendar_.getperson_uid();
    })

    ipcMain.handle('open-add-person-window', () => {
        return calendar_.addpersonwindow();
    })

    ipcMain.handle('confirm-add-person', (event, person) => {
        return calendar_.confirmaddperson(person);
    })

    ipcMain.handle('open-modify-person-window', (event, uid) => {
        return calendar_.modifypersonwindow(uid);
    })

    ipcMain.handle('confirm-modify-person', (event, person) => {
        return calendar_.confirmmodifyperson(person);
    })

    ipcMain.handle('delete-person', (event, uid) => {
        calendar_.deletePerson(uid);
    })

    ipcMain.handle('export-ics-confirm', () => {
        return calendar_.exporthasics();
    })

    ipcMain.handle('import-from-ics', () => {
        return calendar_.importfromics();
    })

    /* ------------------- Observer --------------------- */

    ipcMain.handle('get-observ-menu', (event) => {
        return observe_.getmenu();
    })

    ipcMain.handle('get-used-cpu', async (event) => {
        return await observe_.getusedcpu();
    })

    /* ---------------------- Search -------------------- */

    ipcMain.handle('search-in-index-base', async (event, words) => {
        return search_.searchinindexbase(words);
    })

    ipcMain.handle('fetch-bdd', async (event, path) => {
        return search_.fillBdd(path);
    })

    ipcMain.handle('clear-bdd', async (event) => {
        return search_.clearBdd();
    })

    /* ---------------------- Other --------------------- */

    ipcMain.handle('put-in-cache', async (event, path, value) => {
        utils.putincache(path, value);
    })

    ipcMain.handle('get-cache', async (event, path) => {
        return await utils.getcache(path);
    })

    ipcMain.handle('clear-cache', async (event) => {
        return utils.clearcache();
    })

    ipcMain.handle('reset-super-psd', async (event) => {
        return password_.resetsuperpsd();
    })

    ipcMain.handle('get-color-theme', async (event) => {
        return utils.getcolortheme();
    })

    ipcMain.handle('change-theme', async (event, theme) => {
        return utils.changetheme(theme);
    })
}

module.exports = { Handler };