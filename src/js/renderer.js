//import * as tabs from './tabs.js'
import * as menus from './menus.js'
import { admin_perm } from './admin.js';
// import { setColorTheme } from './color.js'


function set_event() {
    document.getElementById('tools-selector').childNodes.forEach(element => {
        element.addEventListener('click', () => {
            menus.select_icon(element);
            const value = (String(element.childNodes[1].innerHTML)).toLowerCase();
            if (value === "dashboard") {
                menus.loadmenu("Dashboard.html");
            } else {
                if (value === 'password') {
                    admin_perm(() => {
                        menus.loadmenu("tools/" + value + "/main.html");
                    })
                } else if (value === 'settings') {
                    menus.loadmenu("Settings.html");
                } else {
                    menus.loadmenu("tools/" + value + "/main.html");
                }
            }
        })
    })

    document.getElementById('settings-selector').childNodes.forEach(element => {
        element.addEventListener('click', () => {
            menus.select_icon(element);
            const value = (String(element.childNodes[3].innerHTML)).toLowerCase();
            if (value === "settings") {
                menus.loadmenu("Settings.html");
            } else if(value === "profil") {
                menus.loadmenu("Profil.html");
            }
        })
    })
}

set_event();