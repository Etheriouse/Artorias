const { app, BrowserWindow, shell, ipcMain, clipboard } = require('electron');
const { createWindow } = require('./window');
const { runClipboard, saveClipboardHistory } = require('./tools/clipboard');
const { Handler } = require('./ipcHandler');
const utils = require('./utils')
const pass_ = require('./tools/password')

/** Artorias App 
 * settins ⚙️ 
 * moai🗿
 * tabs 📂🗂️📁
 * Calendrier🗓️
 * Convertisseur d'unité ⚖️
 * Clipboard manager📋
 * block note interpreteur markdown / tableau blanc 🖌️
 * integrer compilateur yuzu 🛠️
 * createur template projet 💾🧱
 * loggeur d'entrer user 🧮
 * visualisateur de structure de donnée 📊
 * gestionnaire de mots de passe crypter 🔐
 * /todo list -
 * - Quand on lance l'app on arrive sur un dashboard
 * - theme coloration / image de fond
*/


const pass = require('./tools/password');

app.whenReady().then(async () => {
    Handler();
    runClipboard();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        saveClipboardHistory();
        utils.savecache();
    }
})