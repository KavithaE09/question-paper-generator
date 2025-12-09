const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM departments ORDER BY name');
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, code } = req.body;
    const [result] = await db.query(
      'INSERT INTO departments (name, code) VALUES (?, ?)',
      [name, code]
    );
    res.json({ id: result.insertId, name, code });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
