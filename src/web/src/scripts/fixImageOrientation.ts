import * as loadImage from "blueimp-load-image"

function fixOrientation(file): Promise<string> {
    return loadImage(file, {
        orientation: true,
        canvas: true,
    }).then(function (data) {
        const canvas = data.image as any as HTMLCanvasElement;

        return canvas.toDataURL();
    })
}

export {fixOrientation}