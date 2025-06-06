
let active_section = ''
let active_type = '';

Array.from(document.getElementsByClassName('add-element-convert')).forEach(element => {
    element.addEventListener('click', () => {
        add_new_convertion();
    });
});

document.getElementById('button-clear').addEventListener('click', () => {
    const content = document.getElementById(active_section + '-convert').getElementsByClassName('selected-convertor')[0];
    console.log(content);
    const to_remove = content.children;
    Array.from(to_remove).forEach(element => {
        if (!(element.className === 'add-element-convert'))
            content.removeChild(element);
    })
})

async function get_option_for(select, type) {
    const result = await window.api.getpossibletypefor(type);
    if (result) {
        result.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.text;
            select.appendChild(newOption);
        });
    }
}

async function add_new_convertion() {
    const mainDiv = document.createElement('div');
    mainDiv.className = 'element-convert'
    const leftDiv = document.createElement('div');
    leftDiv.className = 'left-selected';
    const leftHeading = document.createElement('select');
    get_option_for(leftHeading, active_type);
    const leftInput = document.createElement('input');
    leftInput.className = 'first-element';

    const middleHeading = document.createElement('h3');
    middleHeading.textContent = '➡️';
    const rightDiv = document.createElement('div');
    rightDiv.className = 'right-selected';
    const rightHeading = document.createElement('select');
    get_option_for(rightHeading, active_type);
    const rightInput = document.createElement('input');
    rightInput.className = 'second-element';
    const subConvertDiv = document.createElement('div');
    const subConverth3 = document.createElement('h3');
    subConvertDiv.className = 'sub-convert';
    subConverth3.innerHTML = '-';

    leftDiv.appendChild(leftHeading);
    leftDiv.appendChild(leftInput);
    rightDiv.appendChild(rightHeading);
    rightDiv.appendChild(rightInput);
    mainDiv.appendChild(leftDiv);
    mainDiv.appendChild(middleHeading);
    mainDiv.appendChild(rightDiv);
    subConvertDiv.appendChild(subConverth3);
    mainDiv.appendChild(subConvertDiv);

    const selected_ = document.getElementsByClassName('selected-convertor')[0];

    subConvertDiv.addEventListener('click', () => {
        selected_.removeChild(mainDiv);
    })

    rightInput.addEventListener('input', async () => {
        convert_update(active_type, rightHeading, rightInput, leftHeading, leftInput);
    })

    rightHeading.addEventListener('change', async () => {
        convert_update(active_type, leftHeading, leftInput, rightHeading, rightInput);
    })

    leftHeading.addEventListener('change', async () => {
        convert_update(active_type, rightHeading, leftInput, leftHeading, rightInput);
    })

    leftInput.addEventListener('input', async () => {
        convert_update(active_type, leftHeading, leftInput, rightHeading, rightInput);
    })

    selected_.insertBefore(mainDiv, selected_.getElementsByClassName('add-element-convert')[0]);
}

async function convert_update(active_type, from, value, to, value_to) {
    const result = await window.api.fromconvertto(active_type, from.value, value.value, to.value);
    console.log(result)
    if (result.ok) {
        value_to.value = result.value;
    } else {
        value_to.value = 'error';
    }
}

set_section_convert(document.getElementById('selector-unit').value);

function set_section_convert(value) {
    Array.from(document.getElementsByTagName('section')).forEach(element => {
        element.style.display = 'none';
    })
    active_type = value;
    switch (value) {
        case 'quantity':
        case 'states':
        case 'electricity':
            active_section = value;
            document.getElementById(value + '-convert').style.display = 'block';
            break;

        default:
            active_section = 'classic'
            document.getElementById('classic-convert').style.display = 'block';
            break;
    }
}

document.getElementById('selector-unit').addEventListener('change', (event) => {
    set_section_convert(event.target.value)
})
