const { app, BrowserWindow, shell, ipcMain, clipboard } = require('electron');
const { createWindow } = require('./window');
const { runClipboard, saveClipboardHistory, set } = require('./tools/clipboard');
const { save_event, save_person } = require('./tools/calendar');
const { Handler } = require('./ipcHandler');
const utils = require('./utils')
const pass_ = require('./tools/password')
const cal_ = require('./tools/calendar');
const {setup} = require('./tools/observer');
const fs = require('fs');
const path = require('path');
const {saveconfig} = require('./config')

/** Artorias App 
 * settins ⚙️ 
 * moai🗿
 * Calendrier🗓️
 * Convertisseur d'unité ⚖️
 * Clipboard manager📋
 * block note / tableau blanc 🖌️
 * createur template projet 💾🧱
 * gestionnaire de mots de passe crypter 🔐
 * /todo list -
 * - Quand on lance l'app on arrive sur un dashboard
 * - theme coloration / image de fond
 * - faire ma propre library de grand nombre
 * - interpreteur markdown 📓
*/


app.whenReady().then(async () => {
    Handler();
    runClipboard();
    createWindow();
    //setup();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        saveClipboardHistory();
        save_event();
        save_person();
        utils.savecache();
        saveconfig()
    }
})