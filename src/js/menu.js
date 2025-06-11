const tools = [
    { icon: "⛩️", label: "Dashboard" },
    { icon: "🗓️", label: "Calendar" },
    { icon: "📋", label: "Clipboard" },
    { icon: "⚖️", label: "Converter" },
    { icon: "📓", label: "Markdown" },
    { icon: "🔍", label: "Observer" },
    { icon: "🔐", label: "Password" },
    { icon: "🧱", label: "Template" },
    { icon: "🖌️", label: "Whiteboard" },
    { icon: "🕹️", label: "Games" }
];

const games = [
    { icon: "💣", label: "Minesweaper" },
    { icon: "✖️", label: "2048" },
    { icon: "🔢", label: "power4" },
    { icon: "🧮", label: "sudoku" }
]

const settings = [
    { icon: "🗿", label: "Profil" },
    { icon: "⚙️", label: "Settings" }
]

function createMenu() {
    const iconss = document.getElementById('icon-selector');

    const toolss = document.createElement('div');
    toolss.id = 'tools-selector'

    tools.forEach(menu_ => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = menu_.icon;
        const h3 = document.createElement('h3');
        h3.innerHTML = menu_.label;
        h3.style.display = 'none'
        div.appendChild(span);
        div.appendChild(h3);
        toolss.appendChild(div);
    })

    const settingss = document.createElement('div');
    settingss.id = 'settings-selector'

    settings.forEach(menu_ => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = menu_.icon;
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