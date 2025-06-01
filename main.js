const { app, BrowserWindow, shell, ipcMain, clipboard } = require('electron');
const { createWindow } = require('./window');
const { runClipboard, saveClipboardHistory } = require('./tools/clipboard');
const { Handler } = require('./ipcHandler');
const utils = require('./utils')
const pass_ = require('./tools/password')

const {DaiNumber} = require('./lib/DaiNumber/dist/main');

const n = new DaiNumber();
console.log(n.toString());
console.log(new DaiNumber('1254,6435').toString());

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
 * - faire ma propre library de grand nombre
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