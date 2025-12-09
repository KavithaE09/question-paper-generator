const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const db = require('../config/database'); // MySQL promise pool

// Configure multer for file upload
const upload = multer({ dest: 'uploads/temp/' });

// Ensure upload directories exist
const imageUploadDir = path.join(__dirname, '../uploads/question-images');
const tempDir = path.join(__dirname, '../uploads/temp');

if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
  console.log('✅ Created directory:', imageUploadDir);
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('✅ Created directory:', tempDir);
}

router.post('/auto-extract', upload.single('file'), async (req, res) => {
  console.log('🚀 AUTO-EXTRACT REQUEST RECEIVED');
  console.log('📦 Request body:', req.body);
  console.log('📁 File:', req.file);
  
  try {
    const { courseCode, unit } = req.body;
    const file = req.file;

    if (!file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    console.log('📁 Processing file:', file.originalname);
    console.log('📚 Course Code:', courseCode);
    console.log('📖 Unit:', unit);

    // Extract images from docx
    const result = await mammoth.convertToHtml(
      { path: file.path },
      {
        convertImage: mammoth.images.imgElement((image) => {
          return image.read("base64").then((imageBuffer) => {
            // Generate unique filename
            const filename = `unit${unit}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
            const imagePath = path.join(imageUploadDir, filename);
            
            // Save image to disk
            fs.writeFileSync(imagePath, Buffer.from(imageBuffer, 'base64'));
            console.log('💾 Saved image:', filename);
            
            // Return the relative URL path
            return {
              src: `/uploads/question-images/${filename}`
            };
          });
        })
      }
    );

    const htmlContent = result.value;
    
    // Parse HTML to extract images
    const imagePattern = /<img[^>]*src="([^"]*)"[^>]*>/g;
    const images = [...htmlContent.matchAll(imagePattern)];
    
    console.log('🖼️  Found images:', images.length);

    let imagesExtracted = 0;
    let questionsUpdated = 0;
    const details = [];

    // Get all questions from database for this unit and course (PROMISE VERSION)
    const [questions] = await db.query(
      'SELECT * FROM questions WHERE course_code = ? AND unit = ? ORDER BY marks',
      [courseCode, unit]
    );
    
    console.log('📝 Found questions in DB:', questions.length);

    // Match images to questions based on order
    let imageIndex = 0;
    for (const question of questions) {
      if (imageIndex < images.length) {
        const imageUrl = images[imageIndex][1];
        
        // Update question with image URL (PROMISE VERSION)
        const [result] = await db.query(
          'UPDATE questions SET image_url = ?, has_diagram = 1 WHERE id = ?',
          [imageUrl, question.id]
        );
        
        console.log('✅ Updated question ID:', question.id);

        details.push({
          questionId: question.id,
          marks: question.marks,
          questionPreview: question.question_text.substring(0, 80),
          imagePath: imageUrl
        });

        questionsUpdated++;
        imageIndex++;
      }
    }

    imagesExtracted = images.length;

    // Clean up temp file
    try {
      fs.unlinkSync(file.path);
      console.log('🧹 Cleaned up temp file');
    } catch (cleanupError) {
      console.warn('⚠️  Could not delete temp file:', cleanupError.message);
    }

    console.log('✅ Extraction complete!');
    console.log(`   Images extracted: ${imagesExtracted}`);
    console.log(`   Questions updated: ${questionsUpdated}`);

    res.json({
      success: true,
      message: `Successfully extracted ${imagesExtracted} images and updated ${questionsUpdated} questions`,
      imagesExtracted,
      questionsUpdated,
      details
    });

  } catch (error) {
    console.error('❌ Error in auto-extract:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up temp file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('⚠️  Could not delete temp file:', cleanupError.message);
      }
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Test endpoint to verify the route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Extract images route is working!',
    directories: {
      images: imageUploadDir,
      temp: tempDir
    }
  });
});

module.exports = router;