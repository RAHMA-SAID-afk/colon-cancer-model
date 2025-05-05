const express = require('express');
const router = express.Router();
const controller = require('../controllers/imageController');
const multer = require('multer');
const path = require('path');

// ✅ Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// ✅ CRUD routes
router.get('/', controller.getImages);
router.get('/:id', controller.getImageById);
router.put('/:id', controller.updateImage);
router.delete('/:id', controller.deleteImage);

// ✅ File upload route (IMPORTANT: this must come after storage config)
router.post('/', upload.single('image'), controller.uploadImage);

// ✅ EXPORT router (this fixes your crash)
module.exports = router;
