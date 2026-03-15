import { useState } from 'react';
import { QuestionPaperDetails } from '../types';

interface QuestionPaperDetailsFormProps {
  department: string;
  courseCode: string;
  courseName: string;
  onNext: (details: QuestionPaperDetails) => void;
  onBack?: () => void;
}

export default function QuestionPaperDetailsForm({
  department,
  courseCode,
  courseName,
  onNext,
  onBack,
}: QuestionPaperDetailsFormProps) {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [semester, setSemester] = useState('Odd Semester');
  const [examType, setExamType] = useState('CAT I');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const details: QuestionPaperDetails = {
      department,
      courseCode,
      courseName,
      academicYear,
      semester,
      examType,
      year: '',
      regulation: '',
      examDate: ''
    };

    onNext(details);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">FRANCIS XAVIER ENGINEERING COLLEGE, TIRUNELVELI</h1>
          <p className="text-center text-blue-200 mt-1">Question Paper Generation System</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="bg-blue-900 text-white py-3 px-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold">Question Paper Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="2027-28">2027-28</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Odd Semester">Odd Semester</option>
                  <option value="Even Semester">Even Semester</option>
                </select>
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="CAT I">CAT I</option>
                  <option value="CAT II">CAT II</option>
                  <option value="Model Exam">Model Exam</option>
                  <option value="End Semester">End Semester</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  value={`${courseCode} - ${courseName}`}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-4">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition ml-auto"
              >
                Create Question Paper
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}