const { createChildWindow, closeWindow } = require('../window');
const { config, admin_pwd } = require('../config');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');

let psd_id_now;
let adminwindow;
let try_pwd = 0;

var last_psd_gived;

async function getobjectpsd() {
    try {
        return get_json()[psd_id_now];;
    } catch (err) {
        console.error("Error when reading file", err);
        return 'Error when reading file';
    }
}

async function loadpsds() {
    try {
        return get_json();
    } catch (err) {
        console.error("Error when reading file", err);
        return undefined;
    }
}

async function modifywindow(psd_id) {
    createChildWindow('tools/password/modify', true, { width: 500, height: 525 }, false);
    psd_id_now = psd_id;
}

async function addwindow() {
    let addwindow = createChildWindow('tools/password/add', true, { width: 500, height: 525 }, false);

    const psdAddPromise = new Promise((resolve) => {
        resolvePsdAddPromise = resolve;
    })

    const result = await psdAddPromise;
    addwindow.close();
    addwindow = null;
    console.log(result);
    return result;
}

async function savepsd(psd_obj) {
    const psd_ = encrypt_psd(psd_obj.psd, last_psd_gived);
    psd_obj.psd = psd_;

    try {
        const hashjson = get_json();
        hashjson[psd_id_now] = psd_obj;
        save_json(hashjson);
        closeWindow();
        return { ok: true };
    } catch (err) {
        console.error('error when writing in data ', err);
        return { ok: false };
    }
}

async function adminPassword() {
    adminwindow = createChildWindow('admin', true, { width: 300, height: 250 });

    const pwdPromise = new Promise((resolve) => {
        resolvePwdPromise = resolve;
    })

    const result = await pwdPromise;
    try_pwd = 0;
    if (!result.ok) {
        adminwindow.close();
        adminwindow = null;
    }
    return result;
}

async function confirmedAdminPassword(gived_psd) {
    if (bcrypt.compareSync(gived_psd, admin_pwd)) {
        resolvePwdPromise({ "ok": true })
        adminwindow.close();
        adminwindow = null;
        last_psd_gived = gived_psd;
        return true;
    } else {
        try_pwd++;
        if (try_pwd >= config.tools.password.number_try) {
            resolvePwdPromise({ "ok": undefined });
        }
        return false;
    }
}

async function decrypt_(psd) {
    return decrypt_psd(psd, last_psd_gived);
}

async function encrypt_(psd_object) {
    const site = psd_object.site;
    const user = psd_object.user;
    const url = psd_object.url;

    const password = encrypt_psd(psd_object.psd, last_psd_gived);

    try {
        const hashjson = get_json();

        let nonce = Math.floor(Math.random() * 1000000);
        while (hashjson[nonce]) {
            nonce = Math.floor(Math.random() * 1000000);
        }

        const json_psd = {
            site: site,
            user: user,
            psd: {
                mdp: password.mdp,
                iv: password.iv.toString(crypto.enc.Base64),
                salt: password.salt.toString(crypto.enc.Base64)
            },
            url: url
        }
        hashjson[nonce] = json_psd;
        save_json(hashjson);
        resolvePsdAddPromise({ "ok": true })
        return { ok: true };
    } catch (err) {
        console.error('error when writing in data ', err);
        return { ok: false };
    }
}

async function delete_(psd_to_delete) {
    try {
        const hashjson = get_json();
        psd_to_delete.forEach(id => {
            delete hashjson[id];
        });
        save_json(hashjson);
        return { ok: true };
    } catch (err) {
        console.error('error when reading file ', err)
        return { ok: false };
    }
}

function get_json() {
    try {
        const jsonbrut = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/password/hash.json"), 'utf-8'));
        const hmac = compute_hmac(jsonbrut.data, last_psd_gived);
        if (hmac !== jsonbrut.hmac) {
            save_json({})
            return get_json();
        }
        return decrypt_file(jsonbrut, last_psd_gived);
    } catch (error) {
        if (error.code === 'ENOENT') {
            save_json({})
            return get_json();
        } else {
            console.log(error);
        }
    }

}

function save_json(json_to_save) {
    const jsoncrypt = encrypt_file(json_to_save, last_psd_gived);
    const hmac = compute_hmac(jsoncrypt.data, last_psd_gived);
    fs.writeFileSync(path.join(__dirname, "../data/password/hash.json"), JSON.stringify({ data: jsoncrypt.data, salt: jsoncrypt.salt, iv: jsoncrypt.iv, hmac }))
}

function resetsuperpsd() {
    fs.writeFileSync(path.join(__dirname, "../data/password/config.json"), JSON.stringify({ admin_pwd: "" }));
    if (fs.existsSync(path.join(__dirname, "../data/password/hash.json"))) {
        fs.rmSync(path.join(__dirname, "../data/password/hash.json"));
    }
    return { ok: true };
}

function compute_hmac(data, admin_pwd) {
    return crypto.HmacSHA256(data, admin_pwd).toString();
}

function encrypt_file(data, admin_pwd) {
    const salt = crypto.lib.WordArray.random(128 / 8);
    const key = crypto.PBKDF2(admin_pwd, salt, {
        keySize: 256 / 32,
        iterations: 100000
    });
    const iv = crypto.lib.WordArray.random(16);
    const encrypted = crypto.AES.encrypt(JSON.stringify(data), key, { iv: iv }).toString();
    return {
        data: encrypted,
        salt: salt.toString(crypto.enc.Base64),
        iv: iv.toString(crypto.enc.Base64)
    };
}

function decrypt_file(file_object, admin_pwd) {
    const salt = crypto.enc.Base64.parse(file_object.salt);
    const iv = crypto.enc.Base64.parse(file_object.iv);
    const key = crypto.PBKDF2(admin_pwd, salt, {
        keySize: 256 / 32,
        iterations: 100000
    });
    const decrypted = crypto.AES.decrypt(file_object.data, key, { iv: iv });
    return JSON.parse(decrypted.toString(crypto.enc.Utf8));
}

function encrypt_psd(password, admin) {
    const salt = crypto.lib.WordArray.random(128 / 8);
    const key256bits = crypto.PBKDF2(admin, salt, {
        keySize: 256 / 32,
        iterations: 100000
    });
    const iv = crypto.lib.WordArray.random(16);
    return {
        mdp: crypto.AES.encrypt(password, key256bits, { iv: iv }).toString(),
        iv: iv.toString(crypto.enc.Base64),
        salt: salt.toString(crypto.enc.Base64)
    }
}

function decrypt_psd(chiffred, admin) {
    const mdp = chiffred.mdp;
    const iv = crypto.enc.Base64.parse(chiffred.iv);
    const salt = crypto.enc.Base64.parse(chiffred.salt);
    const key256bits = crypto.PBKDF2(admin, salt, {
        keySize: 256 / 32,
        iterations: 100000
    });
    return crypto.AES.decrypt(mdp, key256bits, { iv: iv }).toString(crypto.enc.Utf8);
}

module.exports = { loadpsds, getobjectpsd, modifywindow, addwindow, savepsd, adminPassword, confirmedAdminPassword, decrypt_, encrypt_, delete_, resetsuperpsd }