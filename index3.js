const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' +  path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));


// Handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Access the uploaded file information with req.file
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
