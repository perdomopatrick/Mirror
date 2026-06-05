const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasCursor = document.getElementById('cursor');
const ctxC = canvasCursor.getContext('2d');
ctxC.save();

const canvasMirror = document.getElementById('mirror');
const ctxM = canvasMirror.getContext('2d');



const uiOverlay = document.getElementById('uiOverlay');

const resumeBtn = document.getElementById('resumeBtn');
resumeBtn.addEventListener('click', () => {
    uiOverlay.style.display = 'none';
});
uiOverlay.addEventListener('click', () => {
    uiOverlay.style.display = 'none';
});


// handle canvas resizing
function resize() {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
    canvasMirror.width = window.innerWidth / 2;
    canvasMirror.height = window.innerHeight;
    canvasCursor.width = window.innerWidth;
    canvasCursor.height = window.innerHeight;
    ctxM.translate(canvas.width, 0);
    ctxM.scale(-1, 1);
    ctxM.save();
}
window.addEventListener('resize', resize);
resize();


const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};
const mouseReal = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

let isDrawing = false

let lastX = 0;
let lastY = 0;

function draw(e) {
    mouseReal.x = e.clientX;
    mouseReal.y = e.clientY;
    if (!isDrawing) return;

    // configure pencil style
    ctx.strokeStyle = '#cf0000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();

    [lastX, lastY] = [mouse.x, mouse.y];
}

// mouse and save coords
canvas.addEventListener('pointermove', (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

canvasMirror.addEventListener('pointermove', (e) => {
    mouse.x = canvas.width - e.offsetX;
    mouse.y = e.offsetY;
});

window.addEventListener('pointermove', draw);

window.addEventListener('pointerdown', (e) => {
    [lastX, lastY] = [mouse.x, mouse.y];
    isDrawing = true;
});
window.addEventListener('pointerup', () => {
    isDrawing = false;
});
window.addEventListener('pointerpress', () => {
    isDrawing = false;
});

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctxM.clearRect(0, 0, canvasMirror.width, canvasMirror.height);
    }
});



function drawCursor(ctx, colour, colour2, is) {

    if (is) {
        x = 2 * canvas.width - mouseReal.x;
        y = mouseReal.y;
    } else {
        x = mouseReal.x;
        y = mouseReal.y;
    }
    // inner dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = colour;
    ctx.fill();

    // outer ring
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = colour2;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawMirror() {
    ctxM.clearRect(0, 0, canvasMirror.width, canvasMirror.height);
    ctxM.drawImage(canvas, 0, 0);
}

function drawCursors() {
    ctxC.clearRect(0, 0, canvasCursor.width, canvasCursor.height);

    drawCursor(ctxC, '#00f200ff', '#00fa0075', false);
    drawCursor(ctxC, '#00eaffff', '#00c0ff75', true);
}

// animation loop 
function animate() {
    drawMirror();
    drawCursors();

    // loop 
    requestAnimationFrame(animate);
}


// start canvas
function init() {
    animate();
}

init();
