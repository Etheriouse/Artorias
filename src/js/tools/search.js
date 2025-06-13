document.getElementById('search-bar').addEventListener('input', async (e) => {
    const result = await window.api.search(e.target.value);

    if (result) {
        document.getElementById('result-search').innerHTML = '';
        if(document.getElementById('search-bar').value === '' || result.length === 0) {
            document.getElementById('result-search').style.display = 'none';
        } else {
            document.getElementById('result-search').style.display = 'flex';
        }
        result.forEach(file => {
            const pathname = file.file.split(/[/\\]/);
            const divfile = document.createElement('div');
            divfile.className = 'file';
            const h3 = document.createElement('h3');
            const p = document.createElement('p');
            h3.innerHTML = pathname.pop();
            p.innerHTML = file.file;
            divfile.appendChild(h3)
            divfile.appendChild(p)
            p.addEventListener('click', () => {
                window.api.openfolder({ path: pathname.join('/'), dirname: false });
            })
            p.style.cursor = 'pointer';
            document.getElementById('result-search').appendChild(divfile);
        });
    }
})

document.getElementById('fetch-bdd').addEventListener('click', async () => {
    if(document.getElementById('path-to-fetch').value) {
        document.getElementById('loading').style.display = 'block'
        const value = document.getElementById('path-to-fetch').value;
        const result = await window.api.fetchbdd(value)
        if(result.ok) {
            document.getElementById('fetch-bdd').style.color = "green";
            document.getElementById('loading').style.display = 'none'
        } else {
            document.getElementById('fetch-bdd').style.color = "red";
            document.getElementById('loading').style.display = 'none'    
        }
    }
})