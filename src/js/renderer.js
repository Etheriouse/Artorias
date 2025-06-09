//import * as tabs from './tabs.js'
import * as menus from './menus.js'
import { admin_perm } from './admin.js';

const tools = [
    { icon: "⛩️", label: "Dashboard" },
    { icon: "📋", label: "Clipboard" },
    { icon: "🖌️", label: "Whiteboard" },
    { icon: "💾", label: "Template" },
    { icon: "⚖️", label: "Converter" },
    { icon: "🔐", label: "Password" }
];

const settings = [
    { icon: "🗿", label: "Profil" },
    { icon: "⚙️", label: "Settings" }
]

function set_event() {
    document.getElementById('tools-selector').childNodes.forEach(element => {
        element.addEventListener('click', () => {
            menus.select_icon(element);
            const value = (String(element.childNodes[3].innerHTML)).toLowerCase();
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