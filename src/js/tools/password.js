import { admin_perm } from "../../js/admin.js";

let pwd_clicked;

document.getElementById('context-menu-modify').addEventListener('click', () => {
    admin_perm(() => {
        modify(pwd_clicked.dataset.id);
    });
})

document.getElementById('context-menu-delete').addEventListener('click', () => {
    admin_perm(async () => {
        const result = await window.api.deletepsd([pwd_clicked.dataset.id]);
        if (result.ok) {
            let div_delete;
            document.getElementById('list-pwd').childNodes.forEach(div => {
                if (div.nodeType === Node.ELEMENT_NODE) {
                    if (div.dataset.id === pwd_clicked.dataset.id) {
                        div_delete = div;
                    }
                }
            })
            document.getElementById('list-pwd').removeChild(div_delete)
        } else {
            alert('delete not worked :c');
        }
    });
})

const menu = document.getElementById('context-menu');
const zone = document.getElementById('zone');

document.addEventListener('click', () => {
    menu.style.display = 'none';
});

const titlepwd = document.getElementById('title-pwd');
Array.from(titlepwd.children).forEach((element, index) => {
    element.addEventListener('click', () => {
        sortPsd(document.getElementById('list-pwd'), index);
    })
})

let i_want_delete = false;

document.getElementById('register-psd').addEventListener('click', async () => {
    await window.window_.passwordadd();
})

document.getElementById('refresh-psd').addEventListener('click', async () => {
    load_pwd_list()
})

document.getElementById('open-folder-psd').addEventListener('click', async () => {
    await window.api.openfolder({ path: 'data/password', dirname: true });
})

document.getElementById('delete-confirm-psd').addEventListener('click', async () => {
    admin_perm(async () => {
        const psd_to_delete = [];
        Array.from(document.getElementsByClassName('checkbox-delete-psd')).forEach(element => {
            if (element.checked) {
                psd_to_delete.push(element.dataset.id);
            }
        })
        const result = await window.api.deletepsd(psd_to_delete);

        if (result.ok) {
            const div_to_delete = [];
            document.getElementById('list-pwd').childNodes.forEach(div => {
                if (div.nodeType === Node.ELEMENT_NODE) {
                    psd_to_delete.forEach(id => {
                        if (id === div.dataset.id) {
                            div_to_delete.push(div);
                        }
                    })
                }
            })
            div_to_delete.forEach(div => {
                document.getElementById('list-pwd').removeChild(div)
            })
        } else {
            alert('delete not worked :c');
        }
    })
})

document.getElementById('delete-psd').addEventListener('click', async () => {
    Array.from(document.getElementsByClassName('checkbox-delete-psd')).forEach(element => {
        if (!i_want_delete) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    })
    if (!i_want_delete) {
        document.getElementById('delete-confirm-psd').style.display = 'block';
    } else {
        document.getElementById('delete-confirm-psd').style.display = 'none';
    }
    i_want_delete = !i_want_delete;
})

async function load_pwd_list() {
    const list = document.getElementById('list-pwd');
    list.innerHTML = '';
    document.getElementById('loading').style.display = 'block'

    const pwds = await window.api.loadpwds();

    for (const id in pwds) {
        //<input type="checkbox" class="checkbox-delete-psd" data>
        const entry = pwds[id];
        const div = document.createElement('div');
        div.dataset.id = id;
        div.className = 'pwd'
        const website = document.createElement('h3');
        website.innerHTML = entry.site;
        const username = document.createElement('h3');
        username.innerHTML = entry.user;
        const pass = document.createElement('h3');
        pass.innerHTML = '**********';
        const url = document.createElement('h3');
        url.className = "url-pwd";
        url.innerHTML = entry.url;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'
        checkbox.style.display = 'none';
        checkbox.className = "checkbox-delete-psd";
        checkbox.dataset.id = id;

        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            menu.style.top = `${e.pageY}px`;
            menu.style.left = `${e.pageX}px`;
            menu.style.display = 'block';
        });

        website.addEventListener('click', (key) => {
            if (!key.ctrlKey) {
                window.api.settopaper(website.innerHTML);
            }
        })

        username.addEventListener('click', (key) => {
            if (!key.ctrlKey) {
                window.api.settopaper(username.innerHTML);
            }
        })

        url.addEventListener('click', (key) => {
            if (!key.ctrlKey) {
                window.api.settopaper(url.innerHTML);
            }
        })

        div.appendChild(website);
        div.appendChild(username);
        div.appendChild(pass);
        div.appendChild(url);
        div.appendChild(checkbox);

        list.insertBefore(div, list.children[1])
    }

    list.style.display = 'block';
    document.getElementById('loading').style.display = 'none'

    setup_event_listenner();
    sortPsd(document.getElementById('list-pwd'), 0);

}
load_pwd_list();

function modify(pwd) {
    window.window_.passwordmodify(pwd);
}
function delete_(pwd) {
    window.api.deletepsd([pwd]);
}

function setup_event_listenner() {
    let pwd_list = document.getElementsByClassName('pwd');
    Array.from(pwd_list).forEach(element => {
        element.addEventListener('click', (event) => {
            if (i_want_delete) {
                if (element.lastChild.checked) {
                    element.lastChild.checked = false;
                } else {
                    element.lastChild.checked = true;
                }
            }
        })
    })

    Array.from(pwd_list).forEach(element => {
        element.addEventListener('contextmenu', (event) => {
            pwd_clicked = element;
        })
    })

    Array.from(document.getElementsByClassName('url-pwd')).forEach(pwd_h3 => {
        pwd_h3.addEventListener('click', (event) => {
            if (event.ctrlKey && !i_want_delete) {
                window.api.opensite(pwd_h3.innerHTML);
            }
        })
    })
}

function sortPsd(div, indexSousElement) {
    if (!div || !div.children) return;

    // Supprimer les anciens titres de section
    const anciensTitres = div.querySelectorAll('.groupe-psd');
    anciensTitres.forEach(titre => titre.remove());

    // Récupérer les enfants HTML (hors anciens titres)
    const enfants = Array.from(div.children).filter(el => !el.classList.contains('groupe-psd'));

    // Grouper par première lettre
    const groupes = {};

    enfants.forEach(child => {
        const h3s = child.querySelectorAll('h3');
        const texte = h3s[indexSousElement]?.innerText.trim() || '';
        const lettre = texte[0]?.toUpperCase() || '?';

        if (!groupes[lettre]) groupes[lettre] = [];
        groupes[lettre].push({ element: child, texte });
    });

    // Nettoyer le conteneur
    div.innerHTML = '';

    // Trier les lettres
    const lettresTriees = Object.keys(groupes).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    );

    // Insérer les groupes triés
    lettresTriees.forEach(lettre => {
        const titre = document.createElement('div');
        titre.className = 'groupe-psd';
        let groups = document.createElement('h3');
        groups.innerHTML = lettre;
        titre.appendChild(groups);
        div.appendChild(titre);

        // Trier les enfants dans le groupe
        groupes[lettre].sort((a, b) =>
            a.texte.localeCompare(b.texte, undefined, { sensitivity: 'base' })
        );

        groupes[lettre].forEach(({ element }) => div.appendChild(element));
    });
}