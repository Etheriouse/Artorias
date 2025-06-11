const input = document.getElementById('input-area');
async function load_cache() {
    const result = await window.api.getcache('tools/markdown/input');
    input.value = result;
    const result_ = marked.parse(input.value);
    document.getElementById('output').innerHTML = result_;
}

load_cache();

window.onbeforeunload = () => {
    window.api.putincache('tools/markdown/input', input.value);
}

document.getElementById('input-area').addEventListener('input', () => {
    const result = marked.parse(input.value);
    document.getElementById('output').innerHTML = result;
});

document.getElementById('import').addEventListener('click', async () => {
    const result = await window.api.openfile("md");
    if (result.ok) {
        input.value = result.content;
    } else {
        alert('not loaded');
    }
})

document.getElementById('export').addEventListener('click', async () => {
    const result = await window.api.savefile(input.value, "md");
    if (result.ok) {
        if (!result.canceled) {
            alert('file good saved')
        }
    } else {
        alert('not saved');
    }
})