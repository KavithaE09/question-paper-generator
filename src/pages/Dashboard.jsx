import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Clock, Edit, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onCreateNew, onOpenPaper }) {
  const { user, logout } = useAuth();
  const [allPapers, setAllPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPapers();
  }, []);

  // Fetch all papers (drafts + completed)
  const fetchAllPapers = async () => {
    try {
      setLoading(true);
      const userId = user?.id || 1;
      
      // 🆕 Fetch ALL papers (both draft and completed)
      const response = await fetch(`http://localhost:5000/api/questions/all-papers/${userId}`);
      
      let papers = [];
      
      if (response.ok) {
        const allPapersData = await response.json();
        papers = allPapersData.map(draft => ({
          id: draft.id,
          courseCode: draft.course_code,
          courseName: draft.course_name,
          testType: draft.exam_type || 'N/A',
          academicYear: draft.academic_year || 'N/A',
          semester: draft.semester || 'N/A',
          year: draft.year || 'N/A',
          regulation: draft.regulation || 'N/A',
          created: new Date(draft.created_at).toLocaleDateString(),
          lastSaved: draft.last_saved,
          status: draft.status || 'draft',
          isDraft: draft.status === 'draft'
        }));
        console.log('✅ Papers loaded:', papers);
      }

      // Sort: Drafts first, then completed, then by date
      papers.sort((a, b) => {
        if (a.isDraft && !b.isDraft) return -1;
        if (!a.isDraft && b.isDraft) return 1;
        
        const dateA = new Date(a.lastSaved || a.created);
        const dateB = new Date(b.lastSaved || b.created);
        return dateB - dateA;
      });

      setAllPapers(papers);
    } catch (error) {
      console.error('❌ Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDraft = async (paperId, isCompleted = false) => {
    try {
      console.log('📂 Opening paper:', paperId, 'isCompleted:', isCompleted);
      
      const response = await fetch(`http://localhost:5000/api/questions/load-draft/${paperId}`);
      
      if (response.ok) {
        const draftData = await response.json();
        console.log('✅ Paper data loaded:', draftData);
        
        // 🆕 Pass isReadOnly flag if paper is completed
        if (typeof onOpenPaper === 'function') {
          onOpenPaper(paperId, draftData, isCompleted);
        }
      } else {
        const error = await response.json();
        console.error('Failed to load paper:', error);
        alert('Failed to load paper: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading paper:', error);
      alert('Error loading paper: ' + error.message);
    }
  };

  const handleDelete = async (e, paper) => {
    e.stopPropagation();
    
    const confirmMsg = paper.isDraft 
      ? 'Are you sure you want to delete this draft?' 
      : 'Are you sure you want to delete this completed paper?';
    
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questions/paper/${paper.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAllPapers(allPapers.filter(p => p.id !== paper.id));
        alert(`✅ ${paper.isDraft ? 'Draft' : 'Paper'} deleted successfully`);
      } else {
        alert('❌ Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
      alert('❌ Failed to delete paper');
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const saved = new Date(timestamp);
    const diffSeconds = Math.floor((now - saved) / 1000);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    return saved.toLocaleDateString();
  };

  const handleCreateNew = () => {
    if (typeof onCreateNew === 'function') {
      onCreateNew();
    } else {
      console.error('onCreateNew is not a function');
    }
  };

  const handlePaperClick = (paper) => {
    // 🆕 Pass completion status when opening paper
    handleOpenDraft(paper.id, !paper.isDraft);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">FRANCIS XAVIER ENGINEERING COLLEGE, TIRUNELVELI</h1>
            <p className="text-blue-200 mt-1">Question Paper Generation System</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Question Papers</h2>
              <p className="text-gray-600 mt-1">Manage and create question papers</p>
            </div>
            <button
              onClick={handleCreateNew}
              type="button"
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create New Paper
            </button>
          </div>

          {/* Papers Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading papers...</p>
            </div>
          ) : allPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPapers.map((paper) => (
                <div
                  key={`${paper.isDraft ? 'draft' : 'completed'}-${paper.id}`}
                  onClick={() => handlePaperClick(paper)}
                  className={`relative border-2 rounded-lg p-5 hover:shadow-xl transition cursor-pointer group ${
                    paper.isDraft 
                      ? 'border-blue-300 bg-blue-50 hover:border-blue-400' 
                      : 'border-green-300 bg-green-50 hover:border-green-400'
                  }`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${
                    paper.isDraft ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {paper.isDraft ? (
                      <>
                        <Edit className="w-3 h-3" />
                        DRAFT
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        COMPLETED
                      </>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, paper)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-md z-10"
                    title={paper.isDraft ? "Delete draft" : "Delete paper"}
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{paper.courseCode}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{paper.courseName}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Exam Type:</span>
                        <span className="font-semibold text-gray-700">{paper.testType}</span>
                      </div>
                      
                      {paper.lastSaved && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {paper.isDraft ? 'Last Saved:' : 'Completed:'}
                          </span>
                          <span className={`font-semibold ${paper.isDraft ? 'text-blue-600' : 'text-green-600'}`}>
                            {getTimeAgo(paper.lastSaved)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Academic Year:</span>
                        <span className="font-semibold text-gray-700">{paper.academicYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Semester:</span>
                        <span className="font-semibold text-gray-700">{paper.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-semibold text-gray-700">{paper.created}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {paper.isDraft ? (
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
                          <Edit className="w-4 h-4" />
                          Continue Editing
                        </button>
                      ) : (
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
                          <Eye className="w-4 h-4" />
                          View Paper
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No question papers yet</p>
              <p className="text-sm mt-2">Click "Create New Paper" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}