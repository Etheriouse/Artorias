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
    },

    getpossibletypefor: async (type) => {
        return ipcRenderer.invoke('get-possible-type-for', type);
    },

    fromconvertto: async (section, fromType, value, toType) => {
        return await ipcRenderer.invoke('from-convert-to', section, fromType, value, toType);
    },

    registerevent: async (when) => {
        ipcRenderer.invoke('register-event', when);
    },

    getevent: async () => {
        return await ipcRenderer.invoke('get-event');
    },

    confirmaddevent: async (event) => {
        return await ipcRenderer.invoke('confirm-event', event);
    },

    geteventday: async (year, month, day) => {
        return await ipcRenderer.invoke('get-event-day', year, month, day);
    },

    confirmmodifyevent: async (event) => {
        return await ipcRenderer.invoke('confirm-modify-event', event);
    },

    deleteevent: async (event) => {
        return await ipcRenderer.invoke('delete-event', event);
    },

    getperson: async () => {
        return await ipcRenderer.invoke('get-person');
    },

    getperson_uid: async () => {
        return await ipcRenderer.invoke('get-by-uid-person');
    },

    addpersonwindow: async () => {
        return await ipcRenderer.invoke('open-add-person-window');
    },

    confirmaddperson: async (person) => {
        return await ipcRenderer.invoke('confirm-add-person', person);
    },

    modifypersonwindow: async (uid) => {
        return await ipcRenderer.invoke('open-modify-person-window', uid);
    },

    confirmmodifyperson: async (person) => {
        return await ipcRenderer.invoke('confirm-modify-person', person);
    },

    deleteperson: async (uid) => {
        return ipcRenderer.invoke('delete-person', uid);
    },

    resetsuperpsd: async () => {
        return await ipcRenderer.invoke('reset-super-psd')
    },

    getobservmenu: async () => {
        return await ipcRenderer.invoke('get-observ-menu')
    },

    getusedcpu: async () => {
        return await ipcRenderer.invoke('get-used-cpu');
    },

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

    addevent: async (event) => {
        return await ipcRenderer.invoke('add-event', event);
    },

    modifyevent: async (event) => {
        return await ipcRenderer.invoke('modify-event', event);
    },

    close: async () => {
        return await ipcRenderer.invoke('close-window');
    }
})