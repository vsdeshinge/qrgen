
// import express from "express";
// import {dirname} from "path";
// import { fileURLToPath } from "url";
// import bodyParser from "body-parser";
// import qr from 'qr-image';
// import fs from "fs";
// import http from "http";
// import socketIO from "socket.io";

const express = require("express");
const {dirname} = require("path");
const {fileURLToPath} = require("url");
const bodyParser = require("body-parser");
const qr = require("qr-image");
const fs = require("fs");
const multer = require('multer');
const path = require("path")


// import Jimp from "jimp";
// import QrCode from "qrcode-reader";
// import { Socket } from "net";


// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);
const PORT = 5500;
var password=false;
app.use(bodyParser.urlencoded({extended:true}));


function generateQr(req,res,next){
    
    

    try{
        var qr_svg = qr.image(req.body["url1"]);
        qr_svg.pipe(fs.createWriteStream('public/qr_image.png'));

        res.setHeader
        password = true;
        
    }
    catch (error) {
        console.error('QR Code Generation Error:', error);
    }
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        
    

    next();

}




app.use(generateQr);
app.use(express.static("public"));

  


app.get("/", (req, res) => {
    res.sendFile(__dirname + "public/index.html");
    

});

//for upload image

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/'); // Specify the folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });





// Handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Access the uploaded file information with req.file
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully.');
});
  


app.post("/generate",(req,res)=>{
    console.log(password);
    
    
    
    if(password){
        
        
        res.sendFile(__dirname+"/public/index.html");
        

    }
    else{
        res.sendFile(path.join(__dirname+"public/index.html"));
    }
    console.log(req.body);
});




// io.on('connection', (socket) => {
//     console.log('A user connected');
  
//     // Send initial image to the client
//     sendImageToClient(socket);
  
//     // Handle image request from the client
//     socket.on('requestImage', () => {
//       sendImageToClient(socket);
//     });
//   });

//   function sendImageToClient(socket) {
//     const imageBase64 = fs.readFileSync('qr_image.png', 'base64');
//     socket.emit('updateImage', { image: imageBase64 });
//   }


// async function readQRCode(imagePath) {
//     const buffer = fs.readFileSync(imagePath);
//     const image = await Jimp.read(buffer);
  
//     const qr = new QrCode();
//     qr.callback = function (err, value) {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       console.log('QR Code value:', value.result);
//     };
  
//     qr.decode(image.bitmap);
//   }
  
  
//   const imagePath = 'qr_image.png';
  
  
//   readQRCode(imagePath);
  
  


app.listen(PORT,()=>{
    console.log(`listern from ${PORT}`);
});
