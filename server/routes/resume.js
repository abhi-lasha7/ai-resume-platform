const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadAndAnalyze, getMyAnalyses } = require('../controllers/resumeController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF and DOCX files are allowed'));
  }
});

router.post('/analyze', protect, upload.single('resume'), uploadAndAnalyze);
router.get('/my-analyses', protect, getMyAnalyses);

module.exports = router;