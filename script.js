const settings = {
    willReadFrequently: true
};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d", settings);

const canvasCursor = document.getElementById('cursors');
const ctxC = canvasCursor.getContext('2d');

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCursor.width = window.innerWidth;
    canvasCursor.height = window.innerHeight;
}
window.addEventListener('resize', resize);

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

let isDrawing = false

let lastX = 0;
let lastY = 0;

const history = [];


function draw(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
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

window.addEventListener('pointermove', draw);

window.addEventListener('pointerdown', (e) => {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    history.push(img);
    [lastX, lastY] = [mouse.x, mouse.y];
    isDrawing = true;
});
window.addEventListener('pointerup', () => {
    isDrawing = false;
});
window.addEventListener('pointerpress', () => {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    history.push(img);
    isDrawing = false;
});

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.ctrlKey && e.key === 'z') {
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log(history)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (history.length > 0) {
            ctx.putImageData(history.pop(), 0, 0);
        }

    }
});


function drawCursor(ctx, colour, colour2, isRealCursor) {
    let x = mouse.x;
    let y = mouse.y;
    if (!isRealCursor) {
        x = 2 * canvas.width / 2 - mouse.x;
        y = mouse.y;
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
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
}

function drawCursors() {
    ctxC.clearRect(0, 0, canvasCursor.width, canvasCursor.height);

    drawCursor(ctxC, '#00f200ff', '#00fa0075', true);
    drawCursor(ctxC, '#00eaffff', '#00c0ff75', false);
}

// animation loop 
function animate() {
    drawMirror();
    drawCursors();

    // loop 
    requestAnimationFrame(animate);
}

// start canvas
resize();
animate();