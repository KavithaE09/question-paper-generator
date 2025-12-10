import { useState, useEffect } from 'react';
import { useQuestionPaper } from '../context/QuestionPaperContext';
import { useAutoSave } from '../hooks/useAutoSave';
import { Question, TemplateQuestion } from '../types';
import QuestionBank from '../components/QuestionBank/QuestionBank';
import QuestionPaperTemplate from '../components/Template/QuestionPaperTemplate';
import AddQuestionModal from '../components/Modals/AddQuestionModal';
import SyllabusModal from '../components/Modals/SyllabusModal';
import PreviewModal from '../components/Modals/PreviewModal';
import { Eye, Printer, ArrowLeft, Home, BookOpen, FileText, Download, X, CheckCircle, Clock } from 'lucide-react';

// 🆕 Finish Confirmation Modal
function FinishConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Finish Question Paper?</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Once you finish this paper, you won't be able to edit or modify questions anymore. 
          You can only preview the paper.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ This action cannot be undone
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Yes, Finish
          </button>
        </div>
      </div>
    </div>
  );
}

// InstructionModal component
function InstructionModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Instructions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">1. Adding Questions</h3>
            <p className="text-blue-800 text-sm">
              Drag and drop questions from the question bank on the left to the template on the right.
            </p>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-semibold text-green-900 mb-2">2. Removing Questions</h3>
            <p className="text-green-800 text-sm">
              Click the trash icon on any question in the template to remove it.
            </p>
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h3 className="font-semibold text-purple-900 mb-2">3. Preview</h3>
            <p className="text-purple-800 text-sm">
              Click the "Preview" button to see how your question paper will look when printed.
            </p>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <h3 className="font-semibold text-orange-900 mb-2">4. Syllabus</h3>
            <p className="text-orange-800 text-sm">
              Click "SYLLABUS" to view the syllabus structure for the selected exam type.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h3 className="font-semibold text-yellow-900 mb-2">5. Auto-Save</h3>
            <p className="text-yellow-800 text-sm">
              Your work is automatically saved every 3 seconds. Check the save status indicator in the header.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h3 className="font-semibold text-red-900 mb-2">6. Finishing Paper</h3>
            <p className="text-red-800 text-sm">
              Once you're done, click "Finish" to mark the paper as complete. After finishing, you can only preview the paper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionPaperBuilder({ onBackToHome, isReadOnly = false }) {
  const { paperDetails, selectedQuestions, addQuestion, removeQuestion } = useQuestionPaper();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState(null);
  const [isFinished, setIsFinished] = useState(isReadOnly);

  // 🆕 AUTO-SAVE HOOK
  const { saveStatus, lastSaved, paperId, forceSave } = useAutoSave({
    paperDetails,
    selectedQuestions,
    userId: 1
  }, 3000);

  // 🆕 Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return 'Not saved yet';
    
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    
    if (diff < 60) return 'Saved just now';
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)} min ago`;
    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  // 🆕 Save status indicator component
  const SaveStatusIndicator = () => (
    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
      {saveStatus === 'saving' && (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-blue-600">Saving...</span>
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600">{getLastSavedText()}</span>
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-sm text-red-600">Save failed</span>
        </>
      )}
    </div>
  );

  console.log('🎯 QuestionPaperBuilder - paperDetails:', paperDetails);
  console.log('🎯 Course Code being used:', paperDetails?.courseCode);
  console.log('🎯 Selected Questions:', selectedQuestions);
  console.log('💾 Paper ID:', paperId);
  console.log('🔒 Is Finished:', isFinished);

  if (!paperDetails) {
    console.warn('⚠️ No paperDetails available');
    return null;
  }

  const handleDragStart = (question) => {
    if (isFinished) return; // 🔒 Prevent drag when finished
    console.log('🖱️ Drag started for question:', question);
    setDraggedQuestion(question);
  };

  const handleDrop = () => {
    if (isFinished) return; // 🔒 Prevent drop when finished
    
    if (draggedQuestion) {
      console.log('📥 Question dropped:', draggedQuestion);
      
      const isDuplicate = selectedQuestions.some(q => q.id === draggedQuestion.id);
      
      if (isDuplicate) {
        console.warn('⚠️ Duplicate question detected');
        alert('This question has already been added to the template!');
        setDraggedQuestion(null);
        return;
      }

      const part = getPartForMarks(draggedQuestion.marks);
      const questionNumber = `${selectedQuestions.length + 1}`;

      const templateQuestion = {
        id: draggedQuestion.id,
        unit: draggedQuestion.unit,
        marks: draggedQuestion.marks,
        questionText: draggedQuestion.questionText,
        bloom: draggedQuestion.bloom,
        courseOutcome: draggedQuestion.courseOutcome,
        programOutcome: draggedQuestion.programOutcome,
        diagram: draggedQuestion.diagram,
        imageUrl: draggedQuestion.imageUrl,
        questionNumber,
        part,
        topic: undefined,
        type: '',
        totalMarks: 0
      };

      console.log('✅ Adding question to template:', templateQuestion);
      addQuestion(templateQuestion);
      setDraggedQuestion(null);
    }
  };

  const getPartForMarks = (marks) => {
    if (marks === 2) return 'A';
    if (marks === 13) return 'B';
    if (marks === 15) return 'C';
    if (marks <= 2) return 'A';
    if (marks <= 13) return 'B';
    return 'C';
  };

  const handleBackToDashboard = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/dashboard';
    }
  };

  // 🆕 Handle Finish Button Click
  const handleFinishClick = () => {
    if (selectedQuestions.length === 0) {
      alert('⚠️ Please add at least one question before finishing!');
      return;
    }
    setShowFinishModal(true);
  };

  // 🆕 Handle Finish Confirmation
  const handleFinishConfirm = async () => {
    try {
      // First save the current state
      await forceSave();

      // Then mark as completed
      const response = await fetch(`http://localhost:5000/api/questions/complete/${paperId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Paper marked as completed');
        setIsFinished(true);
        setShowFinishModal(false);
        alert('✅ Question paper finished successfully! You can now only preview it.');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          handleBackToDashboard();
        }, 2000);
      } else {
        throw new Error('Failed to mark paper as completed');
      }
    } catch (error) {
      console.error('❌ Error finishing paper:', error);
      alert('❌ Failed to finish paper: ' + error.message);
    }
  };

  // 🆕 Handle Remove Question - only if not finished
  const handleRemoveQuestion = (questionId) => {
    if (isFinished) {
      alert('⚠️ Cannot remove questions from a finished paper!');
      return;
    }
    removeQuestion(questionId);
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.shiksha.com/mediadata/images/1533896395phpbnJBGS_g.jpg)',
          opacity: 0.15,
          zIndex: 0
        }}
      />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* 🆕 UPDATED HEADER */}
        <div className="bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 p-4 border-b-2 border-blue-400 shadow-md print:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md group"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              
              <div className="max-w-lg">
                <h1 className="text-2xl font-bold text-gray-800">Government College of Engineering</h1>
                <p className="text-sm text-gray-700 mt-1">
                  {paperDetails.courseCode} - {paperDetails.courseName}
                </p>
              </div>

              {/* 🆕 Show status indicator */}
              {isFinished ? (
                <div className="flex items-center gap-2 bg-green-100 border-2 border-green-500 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">COMPLETED</span>
                </div>
              ) : (
                <SaveStatusIndicator />
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* 🆕 FINISH BUTTON - only show if not finished */}
              {!isFinished && (
                <button
                  onClick={handleFinishClick}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                  title="Finish Question Paper"
                >
                  <CheckCircle className="w-5 h-5" />
                  Finish
                </button>
              )}

              <button
                onClick={() => setShowInstructionModal(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <FileText className="w-5 h-5" />
                Instruction
              </button>
              
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <Eye className="w-5 h-5" />
                Preview 
              </button>
              
              <button
                onClick={() => setShowSyllabusModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <BookOpen className="w-5 h-5" />
                SYLLABUS
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex gap-6">
            {/* 🆕 Hide question bank if finished */}
            {!isFinished && (
              <div className="w-[30%] h-full print:hidden">
                <QuestionBank
                  courseCode={paperDetails.courseCode}
                  onDragStart={handleDragStart}
                  selectedQuestionIds={selectedQuestions.map(q => q.id)}
                  onAddQuestion={() => setShowAddModal(true)}
                />
              </div>
            )}

            <div className={`${isFinished ? 'w-full' : 'w-[70%]'} h-full print:w-full`}>
              <QuestionPaperTemplate
                paperDetails={paperDetails}
                selectedQuestions={selectedQuestions}
                onQuestionRemove={handleRemoveQuestion}
                onAddQuestion={() => !isFinished && setShowAddModal(false)}
                onViewSyllabus={() => setShowSyllabusModal(true)}
                onPreview={() => setShowPreviewModal(true)}
                onDrop={handleDrop}
                isReadOnly={isFinished}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 Finish Confirmation Modal */}
      {showFinishModal && (
        <FinishConfirmationModal
          onConfirm={handleFinishConfirm}
          onCancel={() => setShowFinishModal(false)}
        />
      )}

      {/* Other Modals */}
      {showInstructionModal && (
        <InstructionModal onClose={() => setShowInstructionModal(false)} />
      )}

      {!isFinished && showAddModal && (
        <AddQuestionModal
          courseCode={paperDetails.courseCode}
          onClose={() => setShowAddModal(false)}
          onSubmit={() => {
            setShowAddModal(false);
          }}
        />
      )}

      {showSyllabusModal && (
        <SyllabusModal
          examType={paperDetails.examType}
          onClose={() => setShowSyllabusModal(false)}
        />
      )}

      {showPreviewModal && (
        <PreviewModal
          paperDetails={paperDetails}
          questions={selectedQuestions}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      <style>
        {`
          @keyframes scale-in {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.2s ease-out;
          }

          @media print {
            .bg-gradient-to-r,
            button,
            .print\\:hidden {
              display: none !important;
            }
            .w-\\[30\\%\\] {
              display: none !important;
            }
            .absolute.inset-0 {
              display: none !important;
            }
            .w-\\[70\\%\\],
            .print\\:w-full {
              width: 100% !important;
            }
            .p-6 {
              padding: 0 !important;
            }
            body {
              background: white !important;
            }
            img {
              max-width: 100% !important;
              page-break-inside: avoid !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print\\:break-inside-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
    </div>
  );
}