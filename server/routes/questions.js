const express = require('express');
const db = require('../config/database');

const router = express.Router();

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

module.exports = router;
