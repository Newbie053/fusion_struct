const express = require('express');
const router = express.Router();
const { getProperties, createProperty, deleteProperty } = require('../controllers/propertyController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Storage config for property images
const storage = multer.diskStorage({
  destination: './uploads/properties/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getProperties);
router.post('/', verifyToken, upload.array('images', 10), createProperty);
router.delete('/:id', verifyToken, deleteProperty);

module.exports = router;
