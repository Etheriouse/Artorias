
load_history();
load_cache();
let date__ = [];

let select_delete = [];

async function load_cache() {
    document.getElementById('repeate-refresh').value = await window.api.getcache('tools/clipboard/refresh_interval');
    if (!document.getElementById('repeate-refresh').value) {
        document.getElementById('repeate-refresh').value = 0;
    }
}

async function load_history() {
    const result = await window.api.gethistorypaper();
    const list = document.getElementById('clippaper-list');
    list.innerHTML = ''

    result.forEach(paper => {
        if (paper.type === 'text') {
            const div = document.createElement('div');
            const date = document.createElement('h4');
            date.innerHTML = timeAgo(paper.date);
            date__.push(paper.date);
            const content = document.createElement('p');
            content.className = "content-paper-clip"
            content.innerHTML = escapeHTML(paper.content);

            div.appendChild(date);
            div.appendChild(content);

            div.addEventListener('click', (key) => {
                if (!istoDelete) {
                    window.api.settopaper(content.innerHTML);
                } else {
                    div.className = 'to-delete-clippaper'
                    select_delete.push(paper.date);
                }
            })
            list.prepend(div);
        }
    });

    document.getElementById('loading').style.display = 'none';
    list.scrollTop = 0;
}
const delete_all = document.getElementById('delete-all-button-clippaper');
const delete_button = document.getElementById('delete-button-clippaper');

var istoDelete = false;
document.getElementById('delete-clippaper-icon').addEventListener('click', () => {
    if (delete_all.style.display === 'none') {
        delete_all.style.display = 'block';
        delete_button.style.display = 'block'
    } else {
        delete_button.style.display = 'none'
        delete_all.style.display = 'none';
    }
    istoDelete = !istoDelete;
    if (!istoDelete) {
        Array.from(document.getElementById('clippaper-list').children).forEach(clip => {
            clip.className = '';
        })
        select_delete = []
    }
})

window.addEventListener('keydown', (key) => {
    if (key.key === 'Escape') {
        Array.from(clippaperlist.children).forEach(clip => {
            clip.className = '';
        })
    }
})

const clippaperlist = document.getElementById('clippaper-list');
delete_button.addEventListener('click', async () => {
    const result = await window.api.deletetohistory(select_delete);
    if (result.ok) {
        select_delete = [];
        Array.from(document.getElementsByClassName('to-delete-clippaper')).forEach(div => {
            clippaperlist.removeChild(div);
        })
        delete_button.style.display = 'none'
        delete_all.style.display = 'none';
        istoDelete = !istoDelete;
    } else {
        alert('delete not worked');
    }
})

delete_all.addEventListener('click', () => {
    Array.from(clippaperlist.children).forEach(clip => {
        clip.className = 'to-delete-clippaper';

    })
})

function refresh_update(value) {
    if (value === '0') {
        clearInterval(interval_refresh_id);
    } else {
        clearInterval(interval_refresh_id);
        interval_refresh_id = setInterval(load_history, parseInt(value))
    }
}

document.getElementById('repeate-refresh').addEventListener('change', (event) => {
    window.api.putincache('tools/clipboard/refresh_interval', event.target.value);
    refresh_update(event.target.value)
})

function escapeHTML(html) {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let interval_refresh_id;

function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
}