const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/database');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = './uploads/documents';
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  }
});

// Process DOCX file
router.post('/process-docx', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { courseCode } = req.body;
    
    if (!courseCode) {
      return res.status(400).json({ error: 'Course code is required' });
    }

    // Extract text and images from DOCX
    const result = await mammoth.convertToHtml(
      { path: req.file.path },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const imageBuffer = await image.read();
          const imageDir = './uploads/question-images';
          await fs.mkdir(imageDir, { recursive: true });
          
          const imageName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${image.contentType.split('/')[1]}`;
          const imagePath = path.join(imageDir, imageName);
          
          await fs.writeFile(imagePath, imageBuffer);
          
          return {
            src: `/uploads/question-images/${imageName}`
          };
        })
      }
    );

    const html = result.value;
    const questions = parseQuestionsFromHtml(html);
    
    await fs.unlink(req.file.path);
    
    res.json({
      success: true,
      questions: questions,
      message: `Extracted ${questions.length} questions`
    });

  } catch (error) {
    console.error('Error processing DOCX:', error);
    res.status(500).json({ error: error.message });
  }
});

function parseQuestionsFromHtml(html) {
  const questions = [];
  const parts = html.split(/Q:|Question:|Ques:/i);
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const questionMatch = part.match(/^(.*?)(?:Unit=|$)/is);
    if (!questionMatch) continue;
    
    let questionText = questionMatch[1].trim();
    const imageMatch = questionText.match(/<img[^>]+src="([^"]+)"/);
    const hasImage = !!imageMatch;
    const imagePath = imageMatch ? imageMatch[1] : null;
    
    questionText = questionText.replace(/<img[^>]*>/g, '[See diagram]');
    questionText = questionText.replace(/<[^>]+>/g, '').trim();
    
    const metadataMatch = part.match(/Unit=(\d+).*?Marks=(\d+).*?Bloom=([^,\s]+).*?CO=([^,\s]+).*?PO=([^,\s\n]+)/i);
    
    if (metadataMatch) {
      questions.push({
        questionText: questionText,
        unit: parseInt(metadataMatch[1]),
        marks: parseInt(metadataMatch[2]),
        bloom: metadataMatch[3].trim(),
        courseOutcome: metadataMatch[4].trim(),
        programOutcome: metadataMatch[5].trim(),
        hasImage: hasImage,
        imagePath: imagePath
      });
    }
  }
  
  return questions;
}

router.post('/bulk-insert', async (req, res) => {
  try {
    const { courseCode, questions } = req.body;
    
    if (!courseCode || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const values = questions.map(q => [
      courseCode,
      q.unit,
      q.marks,
      q.questionText,
      q.bloom,
      q.courseOutcome,
      q.programOutcome,
      q.hasImage || false,
      q.imagePath || null
    ]);

    const query = `
      INSERT INTO questions 
      (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, diagram_path)
      VALUES ?
    `;

    await db.query(query, [values]);

    res.json({
      success: true,
      message: `Successfully inserted ${questions.length} questions`
    });

  } catch (error) {
    console.error('Error inserting questions:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;