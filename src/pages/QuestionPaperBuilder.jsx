import { useState, useEffect } from 'react';
import { useQuestionPaper } from '../context/QuestionPaperContext';
import { useAutoSave } from '../hooks/useAutoSave';
import { Question, TemplateQuestion } from '../types';
import QuestionBank from '../components/QuestionBank/QuestionBank';
import QuestionPaperTemplate from '../components/Template/QuestionPaperTemplate';
import AddQuestionModal from '../components/Modals/AddQuestionModal';
import SyllabusModal from '../components/Modals/SyllabusModal';
import PreviewModal from '../components/Modals/PreviewModal';
import { useAuth } from '../context/AuthContext'; 
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

// 🆕 InstructionModal component - Updated with Table Format
function InstructionModal({ onClose }) {
  const handleDownloadPDF = () => {
    const pdfContent = `REVISED Bloom's Taxonomy Action Verbs

I. REMEMBERING
Definition: Exhibit memory of previously learned material by recalling facts, terms, basic concepts, and answers.
Verbs: Choose, Define, Find, How, Label, List, Match, Name, Omit, Recall, Relate, Select, Show, Spell, Tell, What, When, Where, Which, Who, Why

II. UNDERSTANDING
Definition: Demonstrate understanding of facts and ideas by organizing, comparing, translating, interpreting, giving descriptions, and stating main ideas.
Verbs: Classify, Compare, Contrast, Demonstrate, Explain, Extend, Illustrate, Infer, Interpret, Outline, Relate, Rephrase, Show, Summarize, Translate

III. APPLYING
Definition: Solve problems to new situations by applying acquired knowledge, facts, techniques and rules in a different way.
Verbs: Apply, Build, Choose, Construct, Develop, Experiment with, Identify, Interview, Make use of, Model, Organize, Plan, Select, Solve, Utilize

IV. ANALYZING
Definition: Examine and break information into parts by identifying motives or causes. Make inferences and find evidence to support generalizations.
Verbs: Analyze, Assume, Categorize, Classify, Compare, Conclusion, Contrast, Discover, Dissect, Distinguish, Divide, Examine, Function, Inference, Inspect, List, Motive, Relationships, Simplify, Survey, Take part in, Test for, Theme

V. EVALUATING
Definition: Present and defend opinions by making judgments about information, validity of ideas, or quality of work based on a set of criteria.
Verbs: Agree, Appraise, Assess, Award, Choose, Compare, Conclude, Criteria, Criticize, Decide, Deduct, Defend, Determine, Disprove, Estimate, Evaluate, Explain, Importance, Influence, Interpret, Judge, Justify, Mark, Measure, Opinion, Perceive, Prioritize, Prove, Rate, Recommend, Rule on, Select, Support, Value

VI. CREATING
Definition: Compile information together in a different way by combining elements in a new pattern or proposing alternative solutions.
Verbs: Adapt, Build, Change, Choose, Combine, Compile, Compose, Construct, Create, Delete, Design, Develop, Discuss, Elaborate, Estimate, Formulate, Happen, Imagine, Improve, Invent, Make up, Maximize, Minimize, Modify, Original, Originate, Plan, Predict, Propose, Solution, Solve, Suppose, Test, Theory

Reference: Anderson, L. W., & Krathwohl, D. R. (2001). A taxonomy for learning, teaching, and assessing, Abridged Edition. Boston, MA: Allyn and Bacon.`;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blooms_taxonomy_action_verbs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const taxonomyData = [
    {
      level: 'I. Remembering',
      definition: 'Exhibit memory of previously learned material by recalling facts, terms, basic concepts, and answers.',
      verbs: ['Choose', 'Define', 'Find', 'How', 'Label', 'List', 'Match', 'Name', 'Omit', 'Recall', 'Relate', 'Select', 'Show', 'Spell', 'Tell', 'What', 'When', 'Where', 'Which', 'Who', 'Why']
    },
    {
      level: 'II. Understanding',
      definition: 'Demonstrate understanding of facts and ideas by organizing, comparing, translating, interpreting, giving descriptions, and stating main ideas.',
      verbs: ['Classify', 'Compare', 'Contrast', 'Demonstrate', 'Explain', 'Extend', 'Illustrate', 'Infer', 'Interpret', 'Outline', 'Relate', 'Rephrase', 'Show', 'Summarize', 'Translate']
    },
    {
      level: 'III. Applying',
      definition: 'Solve problems to new situations by applying acquired knowledge, facts, techniques and rules in a different way.',
      verbs: ['Apply', 'Build', 'Choose', 'Construct', 'Develop', 'Experiment with', 'Identify', 'Interview', 'Make use of', 'Model', 'Organize', 'Plan', 'Select', 'Solve', 'Utilize']
    },
    {
      level: 'IV. Analyzing',
      definition: 'Examine and break information into parts by identifying motives or causes. Make inferences and find evidence to support generalizations.',
      verbs: ['Analyze', 'Assume', 'Categorize', 'Classify', 'Compare', 'Conclusion', 'Contrast', 'Discover', 'Dissect', 'Distinguish', 'Divide', 'Examine', 'Function', 'Inference', 'Inspect', 'List', 'Motive', 'Relationships', 'Simplify', 'Survey', 'Take part in', 'Test for', 'Theme']
    },
    {
      level: 'V. Evaluating',
      definition: 'Present and defend opinions by making judgments about information, validity of ideas, or quality of work based on a set of criteria.',
      verbs: ['Agree', 'Appraise', 'Assess', 'Award', 'Choose', 'Compare', 'Conclude', 'Criteria', 'Criticize', 'Decide', 'Deduct', 'Defend', 'Determine', 'Disprove', 'Estimate', 'Evaluate', 'Explain', 'Importance', 'Influence', 'Interpret', 'Judge', 'Justify', 'Mark', 'Measure', 'Opinion', 'Perceive', 'Prioritize', 'Prove', 'Rate', 'Recommend', 'Rule on', 'Select', 'Support', 'Value']
    },
    {
      level: 'VI. Creating',
      definition: 'Compile information together in a different way by combining elements in a new pattern or proposing alternative solutions.',
      verbs: ['Adapt', 'Build', 'Change', 'Choose', 'Combine', 'Compile', 'Compose', 'Construct', 'Create', 'Delete', 'Design', 'Develop', 'Discuss', 'Elaborate', 'Estimate', 'Formulate', 'Happen', 'Imagine', 'Improve', 'Invent', 'Make up', 'Maximize', 'Minimize', 'Modify', 'Original', 'Originate', 'Plan', 'Predict', 'Propose', 'Solution', 'Solve', 'Suppose', 'Test', 'Theory']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">REVISED Bloom's Taxonomy Action Verbs</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              title="Download as Text File"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-400">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold text-gray-800 w-1/6">
                    Bloom's Taxonomy
                  </th>
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold text-gray-800 w-2/6">
                    Definitions
                  </th>
                  <th className="border-2 border-gray-400 px-4 py-3 text-left font-bold text-gray-800 w-3/6">
                    Verbs
                  </th>
                </tr>
              </thead>
              <tbody>
                {taxonomyData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border-2 border-gray-400 px-4 py-4 align-top">
                      <span className="font-bold text-purple-700">{item.level}</span>
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-4 align-top">
                      <p className="text-sm text-gray-700 leading-relaxed">{item.definition}</p>
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {item.verbs.map((verb, vIndex) => (
                          <span key={vIndex} className="text-sm text-gray-700">
                            • {verb}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reference */}
          <div className="mt-6 bg-gray-100 border-2 border-gray-300 p-4 rounded-lg">
            <p className="text-sm text-gray-700 italic">
              <strong>Reference:</strong> Anderson, L. W., & Krathwohl, D. R. (2001). A taxonomy for learning, teaching, and assessing, Abridged Edition. Boston, MA: Allyn and Bacon.
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
  const { user } = useAuth();

  // ✅ FIXED: removed || 1 fallback — userId is undefined if user not loaded,
  // and useAutoSave will skip saving until a real userId is available
  const { saveStatus, lastSaved, paperId, forceSave } = useAutoSave({
    paperDetails,
    selectedQuestions,
    userId: user?.id,
    userRole: user?.role || 'faculty'
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
                <h1 className="text-2xl font-bold text-gray-800">Francis Xavier Engineering College</h1>
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