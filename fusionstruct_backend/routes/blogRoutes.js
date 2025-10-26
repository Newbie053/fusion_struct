const express = require('express');
const router = express.Router();
const { getBlogs, createBlog, deleteBlog } = require('../controllers/blogController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Storage config for blog images
const storage = multer.diskStorage({
  destination: './uploads/blogs/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getBlogs);
router.post('/', verifyToken, upload.array('images', 5), createBlog);
router.delete('/:id', verifyToken, deleteBlog);

module.exports = router;
