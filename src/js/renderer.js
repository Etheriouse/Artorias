//import * as tabs from './tabs.js'
import * as menus from './menus.js'
import { admin_perm } from './admin.js';
// import { setColorTheme } from './color.js'

function showGames() {
    const gameIcons = document.querySelectorAll('.games-icons');

    gameIcons.forEach(icon => {
        icon.style.opacity = '1';
        icon.style.transform = 'translateY(0)';
        icon.style.transition = 'transform 0.7s ease'
    });

    gamesHidden = false;
}

function hideGames() {
    const gameIcons = document.querySelectorAll('.games-icons');


    gameIcons.forEach((icon, index) => {
        icon.style.opacity = '0';

        icon.style.transition = 'transform 0.7s ease, opacity 0.3s ease';

        if (index === 0) {
            icon.style.transform = 'translateY(-15px)';
            icon.style.transitionDelay = '0.3s';
        } else if (index === 1) {
            icon.style.transform = 'translateY(-35px)';
            icon.style.transitionDelay = '0.2s';
        } else if (index === 2) {
            icon.style.transform = 'translateY(-70px)';
            icon.style.transitionDelay = '0.1s';
        } else if (index === 3) {
            icon.style.transform = 'translateY(-105px)';
            icon.style.transitionDelay = '0s';
        }
    });
    gamesHidden = true;
}

function set_event() {
    loadCache();
    document.getElementById('tools-selector').querySelectorAll('.icon-menu-span').forEach(span => {
        span.addEventListener('click', () => {
            const value = (String(span.dataset.name)).toLowerCase();
            if (value === "dashboard") {
                menus.loadmenu("Dashboard.html");
            } else {
                if (value === 'password') {
                    menus.loadmenu("tools/" + value + "/main.html");
                } else if (value === 'games') {
                    if (!gamesHidden) {
                        hideGames();
                    } else {
                        showGames();
                    }
                } else if (['minesweeper', '2048', 'power4', 'sudoku'].includes(value)) {
                    menus.loadmenu("tools/games/" + value + "/main.html");
                } else {
                    menus.loadmenu("tools/" + value + "/main.html");
                }
            }
        })
    })

    document.getElementById('settings-selector').querySelectorAll('.icon-menu-span').forEach(span => {
        span.addEventListener('click', () => {
            const value = (String(span.dataset.name)).toLowerCase();
            if (value === "settings") {
                menus.loadmenu("Settings.html");
            } else if (value === "profil") {
                menus.loadmenu("Profil.html");
            }
        })
    })

    // document.getElementById('tools-selector').childNodes.forEach(element => {
    //     element.addEventListener('click', () => {
    //         menus.select_icon(element);
    //         const value = (String(element.childNodes[1].innerHTML)).toLowerCase();
    //         if (value === "dashboard") {
    //             menus.loadmenu("Dashboard.html");
    //         } else {
    //             console.log(value)
    //             if (value === 'password') {
    //                 admin_perm(() => {
    //                     menus.loadmenu("tools/" + value + "/main.html");
    //                 })
    //             } else if (value === 'settings') {
    //                 menus.loadmenu("Settings.html");
    //             } else if (value === 'games') {

    //             } else {
    //                 menus.loadmenu("tools/" + value + "/main.html");
    //             }
    //         }
    //     })
    // })

    // document.getElementById('settings-selector').childNodes.forEach(element => {
    //     element.addEventListener('click', () => {
    //         menus.select_icon(element);
    //         const value = (String(element.childNodes[1].innerHTML)).toLowerCase();
    //         if (value === "settings") {
    //             menus.loadmenu("Settings.html");
    //         } else if (value === "profil") {
    //             menus.loadmenu("Profil.html");
    //         }
    //     })
    // })
}

set_event();