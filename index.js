
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
const { MongoClient } = require('mongodb');


var flag=false;


const uri = 'mongodb+srv://maharshi:RWOKGITl2Yd7fhnA@cluster0.cnsknhn.mongodb.net/thechapristore?retryWrites=true&w=majority';


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect()
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // You can start interacting with the database here
    })
    .catch(err => console.error('Error connecting to MongoDB Atlas', err));



    const db = client.db('thechapristor'); // Replace with your actual database name
    const collection = db.collection('signU');


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
      if (error.message.includes('Bad data')) {
          console.error('Invalid data for QR code generation.');
          // Optionally, you can choose to return a specific response or take alternative actions.
      } else {
          console.error('QR Code Generation Error:', error);
      }
  }
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        
    

    next();

}




app.use(generateQr);
app.use(express.static("public"));
//app.use(printFile)

  


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

function printFile(req,res,next){
  console.log(req.body);
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");



  next()

}

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});







app.post('/login', (req, res) => {
  
  const password = req.body.password;

  collection
    .find({ username: req.body.username }, { username: 1, password: 1, _id: 0 })
    .toArray()
    .then(docs => {
      console.log('Documents retrieved:', docs);
      if (docs.length > 0) {
        const singleObject = docs[0];
        if (password === singleObject.password) {
          console.log('Authentication successful');
          res.sendFile(__dirname + '/public/index.html');
          return; 
        }
      }
      
      
      res.sendFile(__dirname + '/public/login.html');
    })
    .catch(err => {
      console.error('Error retrieving documents', err);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/singup',(req,res)=>{
  req.sendFile(__dirname+"/public/signup.html")
});

app.post('/signup', (req, res) => {

    const dataToInsert ={
      firstname: req.body.firstname,
      username : req.body.username,
      mobilenumber: req.body.mobilenumber,
      email: req.body.email,
      password: req.body.password


    }
    collection.insertOne(dataToInsert)
        .then(result => {

            console.log(`Inserted ${result.insertedCount} document`);
            res.sendFile(__dirname+"/public/login.html");
            
        })
        .catch(err => console.error('Error inserting document', err));
  
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
