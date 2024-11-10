const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder where files will be uploaded
  },
  filename: (req, file, cb) => {
    // Use the original file name with extension as the new filename
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);  // Use timestamp for unique file name
  }
});

// Set up the file upload with limits and allowed file types
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;  // Allowed image types
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype);
    
    cb(isValid ? null : new Error('Invalid file type, only JPEG, JPG, PNG, GIF allowed'));
  }
});

module.exports = upload;
