const path = require('path');
const fs = require('fs');
const { fromPath } = require('pdf2pic');
const Tesseract = require('tesseract.js');
const { ReceiptFile, Receipt } = require('../models');

// 1. Upload scanned receipt (PDF)
exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const receiptFile = await ReceiptFile.create({
      file_name: req.file.originalname,
      file_path: req.file.path,
      is_valid: false,
      is_processed: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json({ message: 'File uploaded.', id: receiptFile.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Validate uploaded file (PDF)
exports.validateReceipt = async (req, res) => {
  try {
    const { id } = req.body;
    const receiptFile = await ReceiptFile.findByPk(id);
    if (!receiptFile) {
      return res.status(404).json({ error: 'Receipt file not found.' });
    }
    if (!fs.existsSync(receiptFile.file_path)) {
      receiptFile.is_valid = false;
      receiptFile.invalid_reason = 'File not found on server.';
      await receiptFile.save();
      return res.status(400).json({ error: 'File not found on server.' });
    }
    if (path.extname(receiptFile.file_name).toLowerCase() !== '.pdf') {
      receiptFile.is_valid = false;
      receiptFile.invalid_reason = 'Invalid file extension.';
      await receiptFile.save();
      return res.status(400).json({ error: 'Invalid file extension.' });
    }
    // Simple PDF validation: check file can be opened
    try {
      fs.openSync(receiptFile.file_path, 'r');
      receiptFile.is_valid = true;
      receiptFile.invalid_reason = null;
      await receiptFile.save();
      return res.json({ message: 'PDF is valid.' });
    } catch (e) {
      receiptFile.is_valid = false;
      receiptFile.invalid_reason = 'Corrupted or unreadable PDF.';
      await receiptFile.save();
      return res.status(400).json({ error: 'Corrupted or unreadable PDF.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Process receipt (OCR extraction only)
exports.processReceipt = async (req, res) => {
  try {
    const { id } = req.body;
    const receiptFile = await ReceiptFile.findByPk(id);
    if (!receiptFile) {
      return res.status(404).json({ error: 'Receipt file not found.' });
    }
    if (!receiptFile.is_valid) {
      return res.status(400).json({ error: 'File is not valid for processing.' });
    }

    const outputDir = path.join(__dirname, '../uploads/ocr_temp');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Convert each PDF page to image
    const pdf2picOptions = {
      density: 200,
      savename: `page`,
      savedir: outputDir,
      format: "png",
      size: "1200x1200"
    };
    const storeAsImage = fromPath(receiptFile.file_path, pdf2picOptions);

    const pdfBuffer = fs.readFileSync(receiptFile.file_path);
    const pageCount = (pdfBuffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length || 1;

    let ocrText = '';
    for (let i = 1; i <= pageCount; i++) {
      const result = await storeAsImage(i);
      const ocr = await Tesseract.recognize(result.path, 'eng');
      ocrText += ocr.data.text + '\n';
      fs.unlinkSync(result.path);
    }

    const merchantMatch = ocrText.match(/Merchant[:\- ]+(.+)/i);
    const totalMatch = ocrText.match(/Total[:\- ]+([\d.,]+)/i);
    const dateMatch = ocrText.match(/Date[:\- ]+([^\n]+)/i);

    const merchant_name = merchantMatch ? merchantMatch[1].trim() : null;
    const total_amount = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : null;
    const purchased_at = dateMatch ? new Date(dateMatch[1].trim()) : null;

    let receipt = await Receipt.findOne({ where: { file_path: receiptFile.file_path } });
    if (receipt) {
      receipt.merchant_name = merchant_name;
      receipt.total_amount = total_amount;
      receipt.purchased_at = purchased_at;
      receipt.updated_at = new Date();
      await receipt.save();
    } else {
      receipt = await Receipt.create({
        merchant_name,
        total_amount,
        purchased_at,
        file_path: receiptFile.file_path,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    receiptFile.is_processed = true;
    await receiptFile.save();

    res.json({ message: 'Receipt processed with OCR.', receipt, ocrText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.findAll();
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findByPk(id);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found.' });
    }
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
