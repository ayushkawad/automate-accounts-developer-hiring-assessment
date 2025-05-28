const express = require('express');
const multer = require('multer');
const path = require('path');
const receiptController = require('../controllers/receiptController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// 1. Upload scanned receipt (PDF)
router.post('/upload', upload.single('receipt'), receiptController.uploadReceipt);

// 2. Validate uploaded file (PDF)
router.post('/validate', receiptController.validateReceipt);

// 3. Process receipt (OCR/ extraction)
router.post('/process', receiptController.processReceipt);

// 4. List all receipts
router.get('/receipts', receiptController.getAllReceipts);

// 5. Get receipt by ID
router.get('/receipts/:id', receiptController.getReceiptById);

module.exports = router;
