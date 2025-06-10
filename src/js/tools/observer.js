

const side = document.getElementById('side-categorie');
const maincontent = document.getElementById('main-content');

async function setupObserv() {
    const result = await window.api.getobservmenu();
    console.log(result);

    if(result.ok) {
        result.data.forEach(menu => {
            const div = document.createElement('div');
            div.className = 'menu-observer'
            const title = document.createElement('h3');
            title.innerHTML = menu.name;
            const subtitle = document.createElement('p');
            subtitle.innerHTML = menu.subtitle;
            div.appendChild(title);
            div.appendChild(subtitle);

            div.addEventListener('click', () => {
                Array.from(side.children).forEach(menu_ => {
                    menu_.id = '';
                })
                div.id = 'selected-menu-observer';
                document.getElementById('section')
            })

            side.appendChild(div);
        });
    }

    set_attribut(result.data[0]);
    side.style.display = 'block'
    maincontent.style.display = 'flex'
    document.getElementById('loading').style.display = 'none'
}



setInterval(async () => {
    const result = await window.api.getusedcpu();
    console.log(result);
    document.getElementById('used-cpu').innerHTML = result.currentLoad.toFixed(1);
}, 1000)

function set_attribut(cpu) {

    document.getElementById('speed-cpu').innerHTML = cpu.data.speed;

    document.getElementById('physic-core-cpu').innerHTML = cpu.data.physicalCores;
    document.getElementById('perf-core-cpu').innerHTML = cpu.data.performanceCores;

    document.getElementById('virtu-cpu').innerHTML = cpu.data.virtualization;


    document.getElementById('l1-cache-cpu').innerHTML = ((parseInt(cpu.data.cache.l1d)+parseInt(cpu.data.cache.l1i))/(1024**2)).toFixed(1);
    document.getElementById('l2-cache-cpu').innerHTML = parseInt(cpu.data.cache.l2)/(1024**2);
    document.getElementById('l3-cache-cpu').innerHTML = parseInt(cpu.data.cache.l3)/(1024**2);

    
}

setupObserv();