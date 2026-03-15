import { useState, useEffect } from 'react';
import { Users, FileText, Filter, Search, Eye, Download, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ onOpenPaper }) {
  const { user, logout } = useAuth();
  const [allPapers, setAllPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, draft, completed
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');

  // Stats
  const [stats, setStats] = useState({
    totalPapers: 0,
    completedPapers: 0,
    draftPapers: 0,
    facultyCount: 0
  });

  useEffect(() => {
    fetchAllPapers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, filterDepartment, filterSemester, allPapers]);

  const fetchAllPapers = async () => {
    try {
      setLoading(true);
      const userId = user?.id || 1;
      
      const response = await fetch(
        `http://localhost:5000/api/questions/all-papers/${userId}?role=admin`
      );
      
      if (response.ok) {
        const papersData = await response.json();
        const papers = papersData.map(draft => ({
          id: draft.id,
          courseCode: draft.course_code,
          courseName: draft.course_name,
          testType: draft.exam_type || 'N/A',
          academicYear: draft.academic_year || 'N/A',
          semester: draft.semester || 'N/A',
          department: draft.department || 'N/A',
          created: new Date(draft.created_at).toLocaleDateString(),
          lastSaved: draft.last_saved,
          status: draft.status || 'draft',
          isDraft: draft.status === 'draft',
          createdBy: draft.created_by_name || 'Unknown'
        }));
        
        setAllPapers(papers);
        calculateStats(papers);
      }
    } catch (error) {
      console.error('❌ Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (papers) => {
    const uniqueFaculty = new Set(papers.map(p => p.createdBy));
    
    setStats({
      totalPapers: papers.length,
      completedPapers: papers.filter(p => !p.isDraft).length,
      draftPapers: papers.filter(p => p.isDraft).length,
      facultyCount: uniqueFaculty.size
    });
  };

  const applyFilters = () => {
    let filtered = [...allPapers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(paper => 
        paper.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(paper => 
        filterStatus === 'draft' ? paper.isDraft : !paper.isDraft
      );
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(paper => 
        paper.department === filterDepartment
      );
    }

    // Semester filter
    if (filterSemester !== 'all') {
      filtered = filtered.filter(paper => 
        paper.semester === filterSemester
      );
    }

    setFilteredPapers(filtered);
  };

  const handleViewPaper = (paper) => {
    if (typeof onOpenPaper === 'function') {
      onOpenPaper(paper.id, null, true); // true = read-only mode
    }
  };

  const getUniqueValues = (field) => {
    return [...new Set(allPapers.map(p => p[field]))].sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-blue-200 mt-1">FRANCIS XAVIER ENGINEERING COLLEGE, TIRUNELVELI</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Logged in as</p>
              <p className="font-semibold">{user?.email}</p>
              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">ADMIN</span>
            </div>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Papers</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPapers}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedPapers}</p>
              </div>
              <FileText className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Drafts</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.draftPapers}</p>
              </div>
              <FileText className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Faculty</p>
                <p className="text-3xl font-bold text-purple-600">{stats.facultyCount}</p>
              </div>
              <Users className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {getUniqueValues('department').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Semesters</option>
              {getUniqueValues('semester').map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' || filterSemester !== 'all') && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Search: {searchTerm}
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Status: {filterStatus}
                </span>
              )}
              {filterDepartment !== 'all' && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  Dept: {filterDepartment}
                </span>
              )}
              {filterSemester !== 'all' && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  Sem: {filterSemester}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDepartment('all');
                  setFilterSemester('all');
                }}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Papers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Faculty Question Papers ({filteredPapers.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading papers...</p>
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{paper.courseCode}</div>
                        <div className="text-sm text-gray-500">{paper.courseName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{paper.testType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{paper.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{paper.semester}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-blue-600">{paper.createdBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {paper.created}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {paper.isDraft ? (
                          <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                            DRAFT
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                            COMPLETED
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewPaper(paper)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            title="View Paper"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No papers found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}