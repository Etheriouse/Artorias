const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('./config.json');
var {colortheme} = require('./config.json');

var admin_pwd = require('./data/password/config.json').admin_pwd;

if (!(admin_pwd.substring(0, 7) === '$2b$10$')) {
    const newhash = bcrypt.hashSync(admin_pwd);
    fs.writeFileSync(path.join(__dirname, 'data/password/config.json'), JSON.stringify({admin_pwd: newhash}));
    admin_pwd = newhash;
}

module.exports = { config, admin_pwd, colortheme };