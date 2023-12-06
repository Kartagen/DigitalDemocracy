// Функція для читання qr-коду та переведення його у строку
const {loadImage, createCanvas} = require("canvas");
const decode = require("jsqr");

async function readQRCode(imageBuffer) {
    try {
        const image = await loadImage(imageBuffer);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = decode(imageData.data, imageData.width, imageData.height);
        if (qrCode.data) {
            return qrCode.data
        } else {
            console.error('Unable to read QR code data');
        }
    } catch (error) {
        console.error('Error reading QR code:', error);
        throw error;
    }
}
module.exports = {readQRCode}