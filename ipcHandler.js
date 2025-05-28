const password_ = require('./tools/password');
const clipboard_ = require('./tools/clipboard');
const utils = require('./utils');
const path = require('path');
const fs = require('fs');

const { mainApp, closeWindow } = require('./window');
const { ipcMain, shell } = require('electron');

function Handler() {

    /* --------------------- Window --------------------- */

    ipcMain.handle('load-page', async (event, namemenu) => {
        mainApp().loadFile('src/' + namemenu);
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
        password_.addwindow();
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
        clipboard_.delete_(date);
    })

    /* ---------------------- Other --------------------- */

    ipcMain.handle('put-in-cache', async (event, path, value) => {
        utils.putincache(path, value);
    })

    ipcMain.handle('get-cache', async (event, path) => {
        return await utils.getcache(path);
    })

    ipcMain.handle('clear-cache', async(event) => {
        utils.clearcache();
    })
}

module.exports = {Handler};