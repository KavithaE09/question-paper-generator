const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// ✅ SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate college email
    if (!email.endsWith('@francisxavier.ac.in')) {
      return res.status(403).json({
        error: 'Only Francis Xavier Engineering College email addresses (@francisxavier.ac.in) are allowed'
      });
    }

    // Determine Role
    const determinedRole = email === 'admin@francisxavier.ac.in' ? 'admin' : 'faculty';

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, determinedRole]
    );

    const userId = result.insertId;

    // Create JWT token
    const token = jwt.sign(
      { userId, role: determinedRole },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('New user created:', { userId, email, role: determinedRole });

    res.json({
      user: {
        id: userId,
        name,
        email,
        role: determinedRole
      },
      token,
    });
  } catch (error) {
    console.error(' Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// ✅ EMAIL/PASSWORD LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate college email
    if (!email.endsWith('@francisxavier.ac.in')) {
      return res.status(403).json({
        error: 'Only Francis Xavier Engineering College email addresses (@francisxavier.ac.in) are allowed'
      });
    }

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Prevent Google-only accounts from using password login
    if (user.password === 'google-oauth') {
      return res.status(401).json({ error: 'Please sign in with Google for this account' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log(' User logged in:', { userId: user.id, email: user.email, role: user.role });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ GOOGLE LOGIN ROUTE
router.post('/google-login', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Backend validation for college email
    if (!email.endsWith('@francisxavier.ac.in')) {
      console.log(' Invalid email domain attempted:', email);
      return res.status(403).json({
        error: 'Only Francis Xavier Engineering College email addresses (@francisxavier.ac.in) are allowed'
      });
    }

    // Determine Role
    const determinedRole = email === 'admin@francisxavier.ac.in' ? 'admin' : 'faculty';

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let userId, userRole;

    if (users.length === 0) {
      // Create new user
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, 'google-oauth', determinedRole]
      );
      userId = result.insertId;
      userRole = determinedRole;
      console.log(' New Google user created:', { userId, email, role: userRole });
    } else {
      userId = users[0].id;
      userRole = users[0].role;
      console.log('Existing Google user logged in:', { userId, email, role: userRole });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId, role: userRole },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: userId,
        name,
        email,
        role: userRole
      },
      token,
    });
  } catch (error) {
    console.error(' Google login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;