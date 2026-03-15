const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get Courses (with optional department filter)
router.get('/', async (req, res) => {
  try {
    const { departmentId } = req.query;
    console.log(' Received departmentId:', departmentId);
    console.log('Type of departmentId:', typeof departmentId);
    
    let query = 'SELECT * FROM courses';
    const params = [];

    if (departmentId) {
      query += ' WHERE department_id = ?';
      params.push(departmentId);
    }

    query += ' ORDER BY code';

    console.log(' Query:', query);
    console.log(' Params:', params);

    const [courses] = await db.query(query, params);
    console.log('Courses found:', courses.length);

    
    res.json(courses);

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new Course
router.post('/', async (req, res) => {
  try {
    const { name, code, departmentId } = req.body;

    if (!name || !code || !departmentId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicate course code
    const [existing] = await db.query(
      'SELECT id FROM courses WHERE code = ? LIMIT 1',
      [code]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Course code already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO courses (name, code, department_id) VALUES (?, ?, ?)',
      [name, code, departmentId]
    );

    res.json({
      id: result.insertId,
      name,
      code,
      departmentId
    });

  } catch (error) {
    console.error('Error creating course:', error);

    // Handle duplicate key error (MySQL: ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Course code already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;