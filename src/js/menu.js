const tools = [
    { icon: "⛩️", label: "Dashboard" },
    { icon: "🗓️", label: "Calendar" },
    { icon: "📋", label: "Clipboard" },
    { icon: "⚖️", label: "Converter" },
    { icon: "📓", label: "Markdown" },
    { icon: "💻", label: "Observer" },
    { icon: "🔐", label: "Password" },
    { icon: "🔍", label: "Search" },
    { icon: "🧱", label: "Template" },
    { icon: "🖌️", label: "Whiteboard" },
    { icon: "🕹️", label: "Games" }
];

const games = [
    { icon: "💣", label: "Minesweeper" },
    { icon: "✖️", label: "2048" },
    { icon: "🔢", label: "Power4" },
    { icon: "🧮", label: "Sudoku" }
]

const settings = [
    { icon: "🗿", label: "Profil" },
    { icon: "⚙️", label: "Settings" }
]
var gamesHidden = true;

async function loadCache() {
    gamesHidden = await window.api.getcache('menu/games');
    if (!gamesHidden) {
        const gameIcons = document.querySelectorAll('.games-icons');
        gameIcons.forEach(e => {
            e.style.opacity = '1';
            e.style.transform = 'translateY(0px)';
        })
    }
}

window.onbeforeunload = () => {
    window.api.putincache('menu/games', gamesHidden);
}


function createMenu() {
    const iconss = document.getElementById('icon-selector');

    const toolss = document.createElement('div');
    toolss.id = 'tools-selector'

    tools.forEach(menu_ => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = menu_.icon;
        span.className = 'icon-menu-span'
        span.dataset.name = menu_.label;
        const h3 = document.createElement('h3');
        h3.innerHTML = menu_.label;
        h3.style.display = 'none'
        div.appendChild(span);
        div.appendChild(h3);
        toolss.appendChild(div);
    })

    const gamess = toolss.lastChild;
    gamess.id = "games"

    gamess.firstChild.style.zIndex = 10;
    const gamessubmenu = document.createElement('div');
    gamessubmenu.id = "games-menus";
    gamess.appendChild(gamessubmenu)

    games.forEach(menu_ => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = menu_.icon;
        span.style.fontSize = '25px'
        span.className = 'icon-menu-span'
        span.dataset.name = menu_.label;
        const h3 = document.createElement('h3');
        h3.innerHTML = menu_.label;
        h3.style.display = 'none'
        div.className = 'games-icons'
        div.appendChild(span);
        div.appendChild(h3);
        gamessubmenu.appendChild(div);
    })

    const settingss = document.createElement('div');
    settingss.id = 'settings-selector'

    settings.forEach(menu_ => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = menu_.icon;
        span.className = 'icon-menu-span'
        span.dataset.name = menu_.label;
        const h3 = document.createElement('h3');
        h3.innerHTML = menu_.label;
        h3.style.display = 'none'
        div.appendChild(span);
        div.appendChild(h3);
        settingss.appendChild(div);
    })

    iconss.appendChild(toolss)
    iconss.appendChild(settingss)
}

createMenu();