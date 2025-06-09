

const participants = document.getElementById('participants');
const selector = document.getElementById('add-person');

export async function setupPerson() {
    const persons = await window.api.getperson();

    persons.forEach(person => {
        const div = document.createElement('div');
        div.className = 'a-participant';
        const div_content = document.createElement('div');
        div_content.className = 'div-content'
        const name = document.createElement('h4');
        name.className = 'participant-person';
        name.innerHTML = person.name;
        name.dataset.uid = person.uid;
        const modify = document.createElement('h4');
        modify.className = 'participant-modify';
        modify.innerHTML = '⚙️'
        modify.addEventListener('click', async () => {
            const result = await window.api.modifypersonwindow(person.uid);
            if (result.ok) {
                location.reload();
            } else {
                alert('modification not take in count')
            }
        })
        const div_check = document.createElement('div');
        div_check.className = 'div-check'
        const delete_check = document.createElement('input');
        delete_check.type = 'checkbox'
        delete_check.style.display = 'none'
        delete_check.className = 'participant-delete'
        div_content.appendChild(name)
        //div_content.appendChild(modify)
        div_check.appendChild(delete_check)
        div_check.appendChild(modify)
        div.appendChild(div_content)
        div.appendChild(div_check)
        participants.appendChild(div);

    });

    window.addEventListener('keydown', (key) => {
        if (key.key === 'Control') {
            Array.from(document.getElementsByClassName('participant-delete')).forEach(check => {
                if (check.style.display === 'none') {
                    check.style.display = 'block';
                } else {
                    check.style.display = 'none';
                }
            })

            Array.from(document.getElementsByClassName('participant-modify')).forEach(check => {
                if (check.style.display === 'none') {
                    check.style.display = 'block';
                } else {
                    check.style.display = 'none';
                }
            })
        }
    })

    document.getElementById('person-delete').addEventListener('click', async () => {
        Array.from(document.getElementsByClassName('a-participant')).forEach(async check => {
            if (check.querySelector('.participant-delete').checked) {
                console.log(check.querySelector('.participant-person').dataset.uid)
                await window.api.deleteperson(check.querySelector('.participant-person').dataset.uid)
                location.reload()
            }
        })
    })
}



setupPerson()