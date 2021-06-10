const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let image: HTMLImageElement;

let mouseX, mouseY;

const scaleStep: number = 0.1;
let currentScale: number,
    minScale: number,
    maxScale: number;

let panX: number = 0,
    panY: number = 0;

let isPanning = false;


function recalculateCanvasSize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function loadImage(newImage: HTMLImageElement) {
    image = newImage;

    minScale = canvas.height / image.naturalHeight;
    currentScale = minScale;

    maxScale = 1;

    panX = 0;
    panY = 0;


    redraw();
}

function recalculateFollowMousePanDistance(newScale) {
    const canvasBounds = canvas.getBoundingClientRect();

    // get mouse position relative to canvas element
    const mouseXCanvas = mouseX - canvasBounds.left;
    const mouseYCanvas = mouseY - canvasBounds.top;

    // get mouse position relative to the center of the image,
    // which is centered on the canvas minus the current panning
    const mouseXImage = mouseXCanvas - (canvas.width / 2) - panX;
    const mouseYImage = mouseYCanvas - (canvas.height / 2) - panY;

    // pan is (old rel. dist from mouse to center of image / old scaling factor) = (new rel. dist. from mouse to center of image / new scaling factor)
    // solved for the new rel. distance.
    // since we need the difference between old and new relative distance (which inversed is the distance we need to adjust the image to),
    // we simply subtract the old relative distance
    panX -= ((mouseXImage/currentScale) * newScale) - mouseXImage
    panY -= ((mouseYImage/currentScale) * newScale) - mouseYImage


}

function zoomIn() {
    const newScale = currentScale + scaleStep

    if (newScale <= maxScale) {
        recalculateFollowMousePanDistance(newScale);
        currentScale = newScale;

        redraw();
    }
}

function zoomOut() {
    const newScale = currentScale - scaleStep

    if (newScale >= minScale) {
        recalculateFollowMousePanDistance(newScale);
        currentScale = newScale;

        redraw();
    }
}

function redraw() {
    window.requestAnimationFrame(() => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const tX = (canvas.width / 2) - ((currentScale * image.naturalWidth) / 2) + panX;
        const tY = (canvas.height / 2) - ((currentScale * image.naturalHeight) / 2) + panY;

        ctx.transform(currentScale, 0, 0, currentScale, tX, tY)

        ctx.drawImage(image, 0, 0);
    })
}


recalculateCanvasSize();
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

    if (delta > 0) {
        zoomIn();
    } else {
        zoomOut();
    }
})

canvas.addEventListener('mousedown', e => {
  if(e.button === 1) {
      isPanning = true;
  }
})

canvas.addEventListener('mouseup', e => {
    console.log(e.button);

  if(e.button === 1) {
      isPanning = false;
  }
})

canvas.addEventListener('mousemove', e => {
    mouseX = e.pageX
    mouseY = e.pageY

    if(isPanning) {
        panX += e.movementX;
        panY += e.movementY;

        redraw();
    }
})

canvas.addEventListener('drag', e => {

})





