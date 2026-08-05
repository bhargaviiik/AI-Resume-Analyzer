const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse').default || require('pdf-parse');

const router = express.Router();

// store uploaded file in memory, not on disk — we only need it briefly to extract text
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('resume'), async (req, res) => {   // the middleware runs before handeling happens..
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = await pdfParse(req.file.buffer);
    const extractedText = data.text;

    res.json({
      message: 'Resume parsed successfully',
      textLength: extractedText.length,
      preview: extractedText.slice(0, 300)
    });
  } catch (err) {
    console.error('PDF parsing error:', err);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

module.exports = router;   //router is a function
