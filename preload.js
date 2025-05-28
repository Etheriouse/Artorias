const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadmenu: async (namemenu) => {
        return await ipcRenderer.invoke('load-page', namemenu)
    },

    getobjectpwd: async () => {
        return ipcRenderer.invoke('get-objectpwd')
    },

    loadpwds: async () => {
        return ipcRenderer.invoke('load-pwds')
    },

    confirmedpasswordadmin: async (entered_password) => {
        return ipcRenderer.invoke('confirmed-password', entered_password);
    },

    decryptpassword: async (pwd) => {
        return ipcRenderer.invoke('decrypt-password', pwd);
    },

    savepsd: async (psd_object) => {
        return ipcRenderer.invoke('save-psd', psd_object);
    },

    addpsd: async (psd_object) => {
        return ipcRenderer.invoke('register-password', psd_object);
    },

    deletepsd: async (psd_to_delete) => {
        console.log(psd_to_delete);
        return ipcRenderer.invoke('delete-password', psd_to_delete);
    },

    openfolder: async (path) => {
        ipcRenderer.invoke('open-folder', path);
    },

    opensite: async (url) => {
        ipcRenderer.invoke('open-website', url);
    },

    gethistorypaper: async () => {
        return await ipcRenderer.invoke('get-history-paper');
    },

    settopaper: (text) => {
        ipcRenderer.invoke('set-to-paper', text);
    },

    deletetohistory: (date) => {
        ipcRenderer.invoke('delete-to-history', date);
    },

    putincache: async (path, value) => {
        ipcRenderer.invoke('put-in-cache', path, value);
    },

    getcache: async (path) => {
        return await ipcRenderer.invoke('get-cache', path)
    },

    clearcache: async () => {
        ipcRenderer.invoke('clear-cache');
    }
})

contextBridge.exposeInMainWorld('window_', {
    passwordmodify: async (password_id) => {
        return await ipcRenderer.invoke('password-modify', password_id)
    },

    passwordadd: async () => {
        return await ipcRenderer.invoke('password-add');
    },

    adminpassword: async () => {
        return await ipcRenderer.invoke('admin-password');
    },

    close: async () => {
        return await ipcRenderer.invoke('close-window');
    }
})