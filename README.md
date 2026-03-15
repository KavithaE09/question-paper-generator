# Question Paper Generation System

A comprehensive web application for generating academic question papers with drag-and-drop functionality, built with React, Node.js, Express.js, and MySQL.

## Features

- **User Authentication**: Secure login and signup system
- **Department & Course Selection**: Choose department and course for question paper
- **Question Paper Details**: Configure academic year, semester, exam type, regulation, etc.
- **Question Bank**: Browse and filter questions by unit and marks
- **Drag & Drop**: Intuitive drag-and-drop interface to build question papers
- **Syllabus Information**: View syllabus coverage based on exam type (CAT1, CAT2, Semester)
- **Add Questions**: Add new questions to the question bank
- **Preview & Print**: Preview the formatted question paper and print

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Vite

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- bcryptjs

## Project Structure

```
project/
├── src/                      # Frontend React application
│   ├── components/
│   │   ├── Auth/            # Login & Signup components
│   │   ├── QuestionBank/    # Question bank components
│   │   ├── Template/        # Question paper template components
│   │   └── Modals/          # Modal components
│   ├── context/             # React context providers
│   ├── pages/               # Page components
│   └── types/               # TypeScript type definitions
│
└── server/                   # Backend Express application
    ├── config/              # Database configuration
    ├── routes/              # API routes
    ├── database/            # SQL schema
    └── server.js            # Main server file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:5173

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MySQL credentials:
   ```env
   PORT=5000
   JWT_SECRET=your_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=question_paper_db
   ```

5. Create database and tables:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

6. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on http://localhost:5000

## Usage Guide

### 1. Authentication
- Create an account using the signup page
- Login with your credentials

### 2. Select Department & Course
- Choose your department from the dropdown
- Select the course for which you want to generate a question paper

### 3. Fill Question Paper Details
- Academic Year (e.g., 2024-25)
- Semester (Even/Odd)
- Year (First/Second/Third/Fourth)
- Exam Type (CAT1/CAT2/Semester Exam)
- Regulation (e.g., 2021)
- Exam Date

### 4. Build Question Paper
- **Left Panel**: Question Bank with filters
  - Filter by Unit (1-5)
  - Filter by Marks (2M, 3M, 4M, 5M, 6M, 7M, 10M, 13M, 15M)
  - Search questions
- **Right Panel**: Question Paper Template
  - Drag questions from left to right
  - Questions automatically organized into parts (A, B, C)
  - Remove questions if needed

### 5. Additional Features
- **ADD Button**: Add new questions to the question bank
- **SYLLABUS Button**: View syllabus coverage for the exam type
  - CAT 1: Units 1, 2, and first half of Unit 3
  - CAT 2: Second half of Unit 3, Units 4, 5
  - Semester: All units
- **PREVIEW Button**: Preview the formatted question paper
- **PRINT**: Print the question paper from preview

## Syllabus Coverage

### CAT 1 (Continuous Assessment Test - I)
- Unit 1
- Unit 2
- Unit 3 (First Half)

### CAT 2 (Continuous Assessment Test - II)
- Unit 3 (Second Half)
- Unit 4
- Unit 5

### Semester Exam
- Complete syllabus (All Units 1-5)

## Database Schema

### Main Tables
- **users**: User accounts
- **departments**: Department information
- **courses**: Course details
- **questions**: Question bank
- **question_papers**: Saved question papers
- **question_paper_questions**: Question-paper mappings

## API Documentation

See `server/README.md` for detailed API documentation.

## Build for Production

### Frontend
```bash
npm run dev
```

### Backend
```bash
cd server
npm start
```

## Future Enhancements

- Save and load question papers
- Export to PDF
- Question paper templates with different formats
- Bulk question upload via CSV/Excel
- Question difficulty levels
- Question statistics and analytics
- Multi-language support

## License

This project is created for educational purposes.

## Support

For issues and questions, please create an issue in the repository.
