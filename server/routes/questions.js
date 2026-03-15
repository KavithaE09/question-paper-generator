const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Existing GET endpoint - Get questions by course code
router.get('/', async (req, res) => {
  try {
    const { courseCode } = req.query;

    const [questions] = await db.query(
      'SELECT * FROM questions WHERE course_code = ? ORDER BY unit, marks',
      [courseCode]
    );

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Existing POST endpoint - Add new question
router.post('/', async (req, res) => {
  try {
    const {
      courseCode,
      unit,
      marks,
      questionText,
      bloom,
      courseOutcome,
      programOutcome,
      hasDiagram,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [courseCode, unit, marks, questionText, bloom, courseOutcome, programOutcome, hasDiagram || false]
    );

    res.json({
      id: result.insertId,
      courseCode,
      unit,
      marks,
      questionText,
      bloom,
      courseOutcome,
      programOutcome,
      hasDiagram,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Existing DELETE endpoint - Delete question
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM questions WHERE id = ?', [id]);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ UPDATED: Auto-save with role support
router.post('/auto-save', async (req, res) => {
  try {
    const {
      userId,
      userRole,  // ✅ NEW: Get user role
      paperDetails,
      selectedQuestions,
      paperId
    } = req.body;

    console.log('📝 Auto-save request:', { userId, userRole, paperId });

    if (paperId) {
      // Update existing draft
      await db.query(
        `UPDATE question_papers 
         SET selected_questions = ?,
             last_saved = NOW(),
             status = 'draft'
         WHERE id = ?`,
        [JSON.stringify(selectedQuestions), paperId]
      );

      console.log('✅ Draft updated:', paperId);
      
      res.json({
        success: true,
        message: 'Draft saved successfully',
        paperId: paperId,
        timestamp: new Date()
      });
    } else {
      // Create new draft
      let formattedExamDate = null;
      if (paperDetails.examDate && paperDetails.examDate.trim() !== '') {
        try {
          const dateObj = new Date(paperDetails.examDate);
          if (!isNaN(dateObj.getTime())) {
            formattedExamDate = dateObj.toISOString().split('T')[0]; 
          }
        } catch (e) {
          console.warn('Invalid exam date:', paperDetails.examDate);
        }
      }
      
      if (!formattedExamDate) {
        formattedExamDate = new Date().toISOString().split('T')[0];
      }

      const [result] = await db.query(
        `INSERT INTO question_papers 
         (user_id, created_by_role, department, course_code, course_name, academic_year, 
          semester, year, regulation, exam_type, exam_date, register_number,
          selected_questions, status, last_saved)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', NOW())`,
        [
          userId,
          userRole || 'faculty',  // ✅ Save creator's role
          paperDetails.department || 'Not Specified',
          paperDetails.courseCode || '',
          paperDetails.courseName || '',
          paperDetails.academicYear || '',
          paperDetails.semester || '',
          paperDetails.year || '',
          paperDetails.regulation || '',
          paperDetails.examType || '',
          formattedExamDate,
          paperDetails.registerNumber || null,
          JSON.stringify(selectedQuestions)
        ]
      );

      console.log('✅ New draft created:', result.insertId, 'by role:', userRole);

      res.json({
        success: true,
        message: 'Draft created successfully',
        paperId: result.insertId,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('❌ Auto-save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save draft',
      message: error.message 
    });
  }
});

// Load draft endpoint
router.get('/load-draft/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;

    const [papers] = await db.query(
      `SELECT * FROM question_papers WHERE id = ?`,
      [paperId]
    );

    if (papers.length === 0) {
      console.log('❌ Draft not found:', paperId);
      return res.status(404).json({ error: 'Draft not found' });
    }

    const paper = papers[0];
    
    let selectedQuestions = [];
    if (paper.selected_questions) {
      if (typeof paper.selected_questions === 'string') {
        try {
          selectedQuestions = JSON.parse(paper.selected_questions);
        } catch (e) {
          console.error('Failed to parse selected_questions:', e);
          selectedQuestions = [];
        }
      } else if (Array.isArray(paper.selected_questions)) {
        selectedQuestions = paper.selected_questions;
      } else if (typeof paper.selected_questions === 'object') {
        selectedQuestions = paper.selected_questions;
      }
    }
    
    res.json({
      paperId: paper.id,
      paperDetails: {
        department: paper.department,
        courseCode: paper.course_code,
        courseName: paper.course_name,
        academicYear: paper.academic_year,
        semester: paper.semester,
        year: paper.year,
        regulation: paper.regulation,
        examType: paper.exam_type,
        examDate: paper.exam_date,
        registerNumber: paper.register_number
      },
      selectedQuestions: selectedQuestions,
      lastSaved: paper.last_saved,
      status: paper.status
    });
  } catch (error) {
    console.error(' Error loading draft:', error);
    res.status(500).json({ error: 'Failed to load draft', message: error.message });
  }
});


router.post('/complete/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;

    await db.query(
      `UPDATE question_papers 
       SET status = 'completed', 
           last_saved = NOW() 
       WHERE id = ?`,
      [paperId]
    );

    res.json({ success: true, message: 'Question paper marked as completed' });
  } catch (error) {
    console.error('Error completing paper:', error);
    res.status(500).json({ error: 'Failed to complete paper' });
  }
});

router.get('/drafts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [drafts] = await db.query(
      `SELECT id, course_code, course_name, exam_type, academic_year, semester, 
              year, regulation, last_saved, created_at, status
       FROM question_papers 
       WHERE user_id = ? AND status = 'draft'
       ORDER BY last_saved DESC`,
      [userId]
    );

    res.json(drafts);
  } catch (error) {
    console.error(' Error fetching drafts:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});


router.get('/all-papers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;  

    console.log(' Fetching papers for userId:', userId, 'role:', role);

    let query, params;

    if (role === 'admin') {
      // ✅ Admin sees ALL faculty papers with creator information
      query = `SELECT qp.*, u.name as created_by_name, u.email as created_by_email
               FROM question_papers qp
               LEFT JOIN users u ON qp.user_id = u.id
               WHERE qp.created_by_role = 'faculty' OR qp.created_by_role IS NULL
               ORDER BY 
                 CASE WHEN qp.status = 'draft' THEN 0 ELSE 1 END,
                 qp.last_saved DESC`;
      params = [];

    } else {
      // ✅ Faculty sees ONLY their own papers
      query = `SELECT id, course_code, course_name, exam_type, academic_year, semester, 
                      year, regulation, department, last_saved, created_at, status
               FROM question_papers 
               WHERE user_id = ?
               ORDER BY 
                 CASE WHEN status = 'draft' THEN 0 ELSE 1 END,
                 last_saved DESC`;
      params = [userId];
  
    }

    const [papers] = await db.query(query, params);

    const draftCount = papers.filter(p => p.status === 'draft').length;
    const completedCount = papers.filter(p => p.status === 'completed').length;
    

    
    res.json(papers);
  } catch (error) {
    console.error(' Error fetching all papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// Delete draft/paper
router.delete('/paper/:paperId', async (req, res) => {
  try {
    const { paperId } = req.params;

    await db.query('DELETE FROM question_papers WHERE id = ?', [paperId]);
    
    res.json({ success: true, message: 'Paper deleted successfully' });
  } catch (error) {
    console.error(' Error deleting paper:', error);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

module.exports = router;