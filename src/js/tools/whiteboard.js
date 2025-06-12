const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d')
const decalage = { x: 0, y: 0 };
var savedImage;
var bgc = 'tg'
const history = [];
const redoStack = [];

function saveState() {
    console.log('save');
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undo() {
    if (history.length === 0) return;
    const last = history.pop();
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(last, 0, 0);
}

function redo() {
    if (redoStack.length === 0) return;
    const next = redoStack.pop();
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(next, 0, 0);
}

function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);

    if (!rgbValues || rgbValues.length !== 3) {
        throw new Error('Invalid RGB color format');
    }

    const hex = rgbValues.map(value => {
        const num = parseInt(value, 10);
        return num.toString(16).padStart(2, '0');
    });

    return `#${hex.join('')}`;
}


function set_color_bgc() {
    let va_baiser_ta_mere_javascript = -1;
    Array.from(document.styleSheets).forEach(styleSheet => {
        Array.from(styleSheet.cssRules).forEach(rule => {
            if (rule.selectorText === 'html') {
                if (rule.style.backgroundColor) {
                    if ((String(rule.style.backgroundColor)).startsWith('rgb')) {
                        va_baiser_ta_mere_javascript = rgbToHex(rule.style.backgroundColor);
                    } else {
                        va_baiser_ta_mere_javascript = rule.style.backgroundColor;
                    }
                }
            }
        })
    })
    return va_baiser_ta_mere_javascript
}

const Prevpos = { x: 0, y: 0 };
const pos = { x: 0, y: 0 };

var mouseDown = false;
var mods = "brush";

function getposPixel(mouse) {
    Prevpos.x = pos.x;
    Prevpos.y = pos.y;
    pos.x = mouse.clientX - decalage.x;
    pos.y = mouse.clientY - decalage.y;
}

function doathing() {
    switch (mods) {
        case "brush":
            draw_();
            break;
        case "erase":
            erase_();
            break;
    }
}

window.addEventListener('mousemove', (e) => {
    getposPixel(e);
    if (mods === 'erase') {
        const d = strokep * 10;
        console.log(decalage)
        document.getElementById('erase-cursor').style.display = 'block';
        document.getElementById('erase-cursor').style.top = (e.clientY - (d / 2)) + 'px'
        document.getElementById('erase-cursor').style.left = (e.clientX - 45 - (d / 2)) + 'px'
        document.getElementById('erase-cursor').style.width = (d) + 'px'
        document.getElementById('erase-cursor').style.height = (d) + 'px'
    } else {
        document.getElementById('erase-cursor').style.display = 'none';
    }
    if (mouseDown) {
        doathing();
    }
});

window.addEventListener('mousedown', (e) => {
    mouseDown = true;
        saveState();
});

window.addEventListener('mouseup', (e) => {
    mouseDown = false;

})

window.addEventListener('keydown', (e) => {
    if(e.ctrlKey) {
        if(e.key == 'z') {
            undo();
        }
        if(e.key == 'y') {
            redo();
        }
    }
})

var colorp = "black",
    strokep = 1;

function draw_() {
    const dx = pos.x - Prevpos.x;
    const dy = pos.y - Prevpos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / (strokep / 4)); // Plus il est large, plus il faut d'étapes

    for (let i = 0; i < steps; i++) {
        const x = Prevpos.x + (dx * i) / steps;
        const y = Prevpos.y + (dy * i) / steps;

        ctx.beginPath();
        ctx.arc(x, y, strokep / 2, 0, 2 * Math.PI);
        ctx.fillStyle = colorp;
        ctx.fill();
        ctx.closePath();
    }
}

function erase_() {
    const dx = pos.x - Prevpos.x;
    const dy = pos.y - Prevpos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / (strokep * 0.5));

    for (let i = 0; i < steps; i++) {
        const x = Prevpos.x + (dx * i) / steps;
        const y = Prevpos.y + (dy * i) / steps;

        ctx.beginPath();
        ctx.arc(x, y, (strokep * 5), 0, 2 * Math.PI);
        ctx.fillStyle = bgc;
        ctx.fill();
        ctx.closePath();
    }
}

function loadcanvas() {
    if (!savedImage) return;

    const img = new Image();
    img.src = savedImage;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

function savecanvas() {
    savedImage = canvas.toDataURL('image/png');
}

function resizeCanvas() {
    savecanvas()
    decalage.x = canvas.getBoundingClientRect().x;
    decalage.y = canvas.getBoundingClientRect().y;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    loadcanvas();
}

window.addEventListener('load', function () {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    bgc = set_color_bgc();
});

Array.from(document.getElementById('tools-bar-whiteboard').children).forEach(span => {
    if (span.dataset.color) {
        span.addEventListener('click', () => {
            colorp = span.dataset.color;
        })
    }

    if (span.dataset.stroke) {
        span.addEventListener('click', () => {
            strokep = parseInt(span.dataset.stroke);
        })
    }

    if (span.className.includes('tools-whiteboard') && !(span.id === 'clear-whiteboard')) {
        span.addEventListener('click', () => {
            document.getElementById('tools-bar-whiteboard').querySelectorAll('.tools-whiteboard').forEach(span => {
                span.className = 'tools-whiteboard';
            })
            span.className = 'tools-whiteboard tools-selected-whiteboard';
        })
    }
})

document.getElementById('color-selector-whiteboard').addEventListener('change', (e) => {
    colorp = e.target.value;
})

document.getElementById('brush-whiteboard').addEventListener('click', () => {
    mods = 'brush';
})

document.getElementById('clear-whiteboard').addEventListener('click', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
})

document.getElementById('erase-whiteboard').addEventListener('click', () => {
    mods = 'erase';
})