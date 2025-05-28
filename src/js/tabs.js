const tabs = [];
const deleted_tab = []; // max 10;

function _sub_tab(element) {
    const tab_bar = document.getElementById('tab-bar');
    tab_bar.removeChild(element);
}

export function _add_tab(type) {
    const tab_bar = document.getElementById('tab-bar');

    const tab = document.createElement('div');
    const div = document.createElement('div');
    const icon = document.createElement('img');
    const x = document.createElement('img');
    const title = document.createElement('h3');

    tab.className = 'tab';
    icon.className = 'icon';
    icon.src = "../assets/icons/tools/Clipboard.png";
    x.className = 'x';
    x.src = "../assets/icons/x.png";

    x.addEventListener('click', () => {
        _sub_tab(tab);
    })

    title.innerHTML = type;

    div.appendChild(icon);
    div.appendChild(title);

    tab.appendChild(div);
    tab.appendChild(x);

    tab_bar.insertBefore(tab, document.getElementById('add-tab'));
}