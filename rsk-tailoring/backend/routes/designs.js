const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllDesigns, addDesign, updateDesign, deleteDesign } = require('../controllers/designController');
const { authenticateAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getAllDesigns);
router.post('/', authenticateAdmin, upload.single('image'), addDesign);
router.put('/:id', authenticateAdmin, upload.single('image'), updateDesign);
router.delete('/:id', authenticateAdmin, deleteDesign);

module.exports = router;
