

const fs = require('fs');
const { Mat } = require('opencv4nodejs');
const Jimp = require('jimp');
const QrCode = require('qrcode-reader');

const cv = require('opencv4nodejs');

// Function to read QR code from an image
async function readQRCodeFromImage(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  const image = await Jimp.read(buffer);
  const qr = new QrCode();
  qr.callback = function (err, value) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('QR Code value from image:', value.result);
  };
  qr.decode(image.bitmap);
}

// Function to read QR code from camera
async function readQRCodeFromCamera() {
  const camera = new cv.VideoCapture(0); // 0 represents the default camera
  const qrCodeDetector = new cv.QRCodeDetector();

  const delay = 100; // milliseconds

  setInterval(() => {
    const frame = camera.read();
    const grayFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
    const { data } = grayFrame.getData();
    const decodedInfo = qrCodeDetector.detectAndDecode(grayFrame);
    
    if (decodedInfo && decodedInfo.data) {
      console.log('QR Code value from camera:', decodedInfo.data);
    }

    cv.imshow('QR Code Reader', frame);
    cv.waitKey(delay);
  }, delay);
}

// Replace 'path/to/your/qrcode-image.png' with the path to your QR code image
const imagePath = 'path/to/your/qrcode-image.png';

// Call the function to read the QR code from an image
readQRCodeFromImage(imagePath);

// Uncomment the line below to read QR code from camera
// readQRCodeFromCamera();
