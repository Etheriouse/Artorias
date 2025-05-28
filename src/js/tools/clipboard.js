
load_history();
load_cache();
let date__ = [];

async function load_cache() {
    document.getElementById('repeate-refresh').value = await window.api.getcache('tools/clipboard/refresh_interval');
    if(!document.getElementById('repeate-refresh').value) {
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
            content.innerHTML = escapeHTML(paper.content);
            const clip = document.createElement('button');
            clip.innerHTML = "Clip"
            const delete_paper = document.createElement('button');
            delete_paper.innerHTML = "Delete";
            const div_clip = document.createElement('div');
            div_clip.className = 'clip_button'
            div_clip.appendChild(delete_paper);
            div_clip.appendChild(clip);


            div.appendChild(date);
            div.appendChild(content);
            div.appendChild(div_clip);

            div.addEventListener('click', (key) => {
                if (key.ctrlKey) {
                    if (div.childNodes[1].id === 'detailed') {
                        div.childNodes[1].id = '';
                    } else {
                        list.childNodes.forEach(element => {
                            element.childNodes[1].id = '';
                        })
                        div.childNodes[1].id = 'detailed'
                    }
                }
            })

            clip.addEventListener('click', () => {
                window.api.settopaper(content.innerHTML);
            })

            delete_paper.addEventListener('click', () => {
                console.log(paper.date);
                window.api.deletetohistory([paper.date]);
                list.removeChild(div);
            })

            list.prepend(div);
        }
    });

    document.getElementById('loading').style.display = 'none';
    list.scrollTop = 0;
}

document.getElementById('clear-clippaper').addEventListener('click', () => {
    console.log(date__)
    window.api.deletetohistory(date__);
    document.getElementById('clippaper-list').innerHTML = '';
    date__ = [];
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