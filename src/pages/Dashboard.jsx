import { useState, useEffect } from 'react';
import { Plus, FileText, Layers, FileOutput, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onCreateNew, onOpenPaper }) {
  const { user, logout } = useAuth();
  const [savedPapers, setSavedPapers] = useState([]);

  useEffect(() => {
    const papers = localStorage.getItem('questionPapers');
    if (papers) {
      setSavedPapers(JSON.parse(papers));
    }
  }, []);

  const handleRemove = (e, paperId) => {
    e.stopPropagation(); // Prevent opening the paper when clicking remove
    const updatedPapers = savedPapers.filter(paper => paper.id !== paperId);
    setSavedPapers(updatedPapers);
    localStorage.setItem('questionPapers', JSON.stringify(updatedPapers));
  };

  const handleCreateNew = () => {
    console.log('Create New Paper button clicked!');
    console.log('onCreateNew function:', onCreateNew);
    
    if (typeof onCreateNew === 'function') {
      onCreateNew();
    } else {
      console.error('onCreateNew is not a function:', onCreateNew);
      alert('Error: Create function not properly connected. Check console.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Government College of Engineering</h1>
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
        {/* My Question Papers Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Question Papers</h2>
              <p className="text-gray-600 mt-1">Manage and create question papers</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateNew}
                type="button"
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Create New Paper
              </button>
            </div>
          </div>

          {/* Papers Grid */}
          {savedPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPapers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => onOpenPaper(paper.id)}
                  className="relative border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 transition cursor-pointer bg-white group"
                >
                  {/* Remove Button - Shows on hover */}
                  <button
                    onClick={(e) => handleRemove(e, paper.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-md z-10"
                    title="Remove paper"
                  >
                    <Trash2 size={18} />
                  </button>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">{paper.courseCode}</h3>
                  <p className="text-sm text-gray-600 mb-4">{paper.courseName}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Test Type:</span>
                      <span className="font-semibold text-gray-700">{paper.testType}</span>
                    </div>
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