export const canvasWidth = 400;
export const canvasHeight = 400;
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
export function updateCanvas() {
    ctx.putImageData(imageData, 0, 0);
}
export function putPixel(x, y, color) {
    const index = (y * canvasWidth + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = 255;
}
