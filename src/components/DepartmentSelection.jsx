import { useState, useEffect } from 'react';
import { Building2, BookOpen, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DepartmentSelection({ onNext }) {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchCourses(selectedDepartment);
    } else {
      setCourses([]);
      setSelectedCourse(null);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching departments from:', `${API_URL}/departments`);
      
      const response = await fetch(`${API_URL}/departments`);
      const data = await response.json();
      
      console.log('✅ Departments received:', data);
      setDepartments(data);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (departmentId) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching courses for department ID:', departmentId);
      
      const url = `${API_URL}/courses?departmentId=${departmentId}`;
      console.log('🔍 Full URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('✅ Courses received:', data);
      console.log('✅ Number of courses:', data.length);
      
      setCourses(data);
      setSelectedCourse(null);
      setError(null);
      
      if (data.length === 0) {
        console.warn('⚠️ No courses found for department ID:', departmentId);
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dept = departments.find((d) => d.id === selectedDepartment);
    const course = courses.find((c) => c.id === selectedCourse);

    console.log('📤 Submitting:', { dept, course });

    if (dept && course) {
      onNext(dept.name, course.code, course.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Select Department & Course</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Dropdown */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-5 h-5 mr-2" />
                Department
              </label>
              <select
                value={selectedDepartment ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('🏛️ Department selected:', value);
                  setSelectedDepartment(value ? Number(value) : null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Dropdown */}
            {selectedDepartment && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course
                </label>
                <select
                  value={selectedCourse ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('📚 Course selected:', value);
                    setSelectedCourse(value ? Number(value) : null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">
                    {loading ? 'Loading courses...' : courses.length === 0 ? 'No courses available' : 'Select Course'}
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
                {courses.length === 0 && !loading && (
                  <p className="mt-2 text-sm text-amber-600">
                    ⚠️ No courses found for this department. Please check the database.
                  </p>
                )}
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={!selectedCourse || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? 'Loading...' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}