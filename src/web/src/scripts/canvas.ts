const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

let image: HTMLImageElement;

let mouseX, mouseY;

const scaleStep: number = 0.1;
let currentScale: number,
    minScale: number,
    maxScale: number;

let panX: number = 0,
    panY: number = 0;


function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function loadImage(newImage: HTMLImageElement) {
    image = newImage;

    minScale =  canvas.height / image.naturalHeight;
    currentScale = minScale;

    maxScale = 1;


    redraw();
}

function zoomIn() {
    if(currentScale + scaleStep <= maxScale) {
        currentScale += scaleStep;

        const mXCenter = mouseX - (canvas.width / 2);
        const mYCenter = mouseY - (canvas.height / 2);
        // panX = mXCenter * currentScale;
        // panY = mYCenter * currentScale;


        redraw();
    }
}

function zoomOut() {
    if(currentScale - scaleStep >= minScale) {
        currentScale -= scaleStep;

        const mXCenter = mouseX - (canvas.width / 2);
        const mYCenter = mouseY - (canvas.height / 2);
        // panX = mXCenter * currentScale;
        // panY = mYCenter * currentScale;

        redraw();
    }
}

function redraw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const tX = (canvas.width / 2) - ((currentScale * image.naturalWidth) / 2) + panX;
    const tY = (canvas.height / 2) - ((currentScale * image.naturalHeight) / 2) + panY;

    console.log({tX,tY})

    ctx.transform(currentScale,0,0,currentScale, tX, tY)

    ctx.drawImage(image, 0, 0);
}


resizeCanvas();
const fileInput = document.getElementById('file-input') as HTMLInputElement;

fileInput.onchange = (e) => {
    const target = e.target as HTMLInputElement;

    const image = new Image();
    image.onload = () => {
        loadImage(image);
    }

    image.src = URL.createObjectURL(target.files[0])
}

canvas.addEventListener('wheel', (e: WheelEvent & { wheelDelta: number }) => {
    const delta = e.wheelDelta ?? e.deltaY

    if(delta > 0) {
        zoomIn();
    } else {
        zoomOut();
    }
})

canvas.addEventListener('mousemove', e => {
    mouseX = e.pageX;
    mouseY = e.pageY;
})





