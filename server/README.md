# Question Paper Generation System - Backend

This is the Express.js backend for the Question Paper Generation System.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Database

1. Make sure MySQL is installed and running on your system
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your database credentials:
   ```
   PORT=5000
   JWT_SECRET=your_secret_key_here

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=question_paper_db
   ```

### 3. Create Database and Tables

Run the SQL schema file to create the database and tables:

```bash
mysql -u root -p < database/schema.sql
```

Or manually:
1. Open MySQL Workbench or MySQL command line
2. Run the contents of `database/schema.sql`

### 4. Start the Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login to existing account

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create a new department

### Courses
- `GET /api/courses?departmentId={id}` - Get courses by department
- `POST /api/courses` - Create a new course

### Questions
- `GET /api/questions?courseCode={code}` - Get questions by course code
- `POST /api/questions` - Add a new question
- `DELETE /api/questions/:id` - Delete a question

## Database Schema

### Tables

1. **users** - Stores user accounts
2. **departments** - Stores department information
3. **courses** - Stores course information
4. **questions** - Stores question bank
5. **question_papers** - Stores generated question papers
6. **question_paper_questions** - Maps questions to papers

## Sample Data

The schema includes sample data for:
- 6 Departments (CSE, ECE, EEE, MECH, CIVIL, IT)
- 8 Sample Courses
- 16 Sample Questions for Artificial Intelligence course

## Testing the API

You can test the API using:
- Postman
- cURL
- The frontend application

Example cURL request:
```bash
curl http://localhost:5000/api/departments
```
