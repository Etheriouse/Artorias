const { BrowserWindow } = require('electron');
const path = require('path');

let main_app;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    win.loadFile('src/Dashboard.html');
    win.setMenuBarVisibility(false);
    main_app = win;
}

const createChildWindow = (namefile, block, size, resizeable = true) => {
    if (!size) {
        size = {
            width: 400,
            height: 300
        }
    }
    const childWindow = new BrowserWindow({
        width: size.width,
        height: size.height,
        modal: block || true,
        resizable: resizeable,
        parent: BrowserWindow.getFocusedWindow(),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    childWindow.loadFile('src/' + namefile + '.html');
    childWindow.setMenuBarVisibility(false);
    return childWindow;
}

const closeWindow = () => {
    let win_focus = BrowserWindow.getFocusedWindow();
    if (win_focus) {
        win_focus.close();
    }
}

function loadfile(namemenu) {
    main_app.loadFile('src/' + namemenu);
}

const mainApp = () => main_app;

module.exports = { createWindow, createChildWindow, mainApp, closeWindow, loadfile };