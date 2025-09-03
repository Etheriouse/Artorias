const tools = [
    { icon: "⛩️", label: "Dashboard" },
    { icon: "🗓️", label: "Calendar" },
    { icon: "📋", label: "Clipboard" },
    { icon: "⚖️", label: "Converter" },
    { icon: "📓", label: "Markdown" },
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
    // { icon: "🗿", label: "Profil" },
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


