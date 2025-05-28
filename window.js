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
            sandbox: true
        }
    });

    win.loadFile('src/Dashboard.html');
    win.setMenuBarVisibility(false);
    main_app = win;
}

const createChildWindow = (namefile, block, size) => {
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
        parent: BrowserWindow.getFocusedWindow(),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
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

const mainApp = () => main_app;

module.exports = { createWindow, createChildWindow, mainApp, closeWindow };