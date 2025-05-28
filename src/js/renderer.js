//import * as tabs from './tabs.js'
import * as menus from './menus.js'
import { admin_perm } from './admin.js';

document.getElementById('tools-selector').childNodes.forEach(element => {
    element.addEventListener('click', () => {
        menus.select_icon(element);
        const value = (String (element.childNodes[3].innerHTML)).toLowerCase();
        if(value === "dashboard") {
            menus.loadmenu("Dashboard.html");
        } else {
            if(value === 'password') {
                admin_perm( () => {
                    menus.loadmenu("tools/"+value+"/main.html");
                })
            } else if(value === 'settings') {
                menus.loadmenu("Settings.html");
            } else {
                menus.loadmenu("tools/"+value+"/main.html");
            }
        }
    })
})