const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/database');

const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const courseRoutes = require('./routes/courses');
const questionRoutes = require('./routes/questions');
const importRoutes = require('./routes/import');
const extractImagesRoutes = require('./routes/extract-images'); // ADD THIS

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/import', importRoutes);
app.use('/api/extract-images', extractImagesRoutes); // ADD THIS


app.get('/', (req, res) => {
  res.json({ message: 'Question Paper Generation System API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});