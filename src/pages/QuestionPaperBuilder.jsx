import { useState } from 'react';
import { useQuestionPaper } from '../context/QuestionPaperContext';
import { Question, TemplateQuestion } from '../types';
import QuestionBank from '../components/QuestionBank/QuestionBank';
import QuestionPaperTemplate from '../components/Template/QuestionPaperTemplate';
import AddQuestionModal from '../components/Modals/AddQuestionModal';
import SyllabusModal from '../components/Modals/SyllabusModal';
import PreviewModal from '../components/Modals/PreviewModal';
import { Eye, Printer, ArrowLeft, Home, BookOpen, FileText, Download, X } from 'lucide-react';

// Instruction Modal Component
function InstructionModal({ onClose }) {
  const [showDownload, setShowDownload] = useState(false);

  const handleDownload = () => {
    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = '/blooms_instruction.pdf';
    link.download = 'Blooms_Taxonomy_Instructions.pdf';
    link.click();
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Bloom's Taxonomy Instructions
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
              REVISED Bloom's Taxonomy Action Verbs
            </h3>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-3 text-left font-bold">Level</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">I. Remembering</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">II. Understanding</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">III. Applying</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">IV. Analyzing</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">V. Evaluating</th>
                    <th className="border border-gray-300 p-3 text-left font-bold">VI. Creating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold bg-gray-50">Definition</td>
                    <td className="border border-gray-300 p-3 text-sm">Exhibit memory of previously learned material by recalling facts, terms, basic concepts, and answers.</td>
                    <td className="border border-gray-300 p-3 text-sm">Demonstrate understanding of facts and ideas by organizing, comparing, translating, interpreting, giving descriptions, and stating main ideas.</td>
                    <td className="border border-gray-300 p-3 text-sm">Solve problems to new situations by applying acquired knowledge, facts, techniques and rules in a different way.</td>
                    <td className="border border-gray-300 p-3 text-sm">Examine and break information into parts by identifying motives or causes. Make inferences and find evidence to support generalizations.</td>
                    <td className="border border-gray-300 p-3 text-sm">Present and defend opinions by making judgments about information, validity of ideas, or quality of work based on a set of criteria.</td>
                    <td className="border border-gray-300 p-3 text-sm">Compile information together in a different way by combining elements in a new pattern or proposing alternative solutions.</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold bg-gray-50">Action Verbs</td>
                    <td className="border border-gray-300 p-3 text-sm">
                      Choose, Define, Find, How, Label, List, Match, Name, Omit, Recall, Relate, Select, Show, Spell, Tell, What, When, Where, Which, Who, Why
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">
                      Classify, Compare, Contrast, Demonstrate, Explain, Extend, Illustrate, Infer, Interpret, Outline, Relate, Rephrase, Show, Summarize, Translate
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">
                      Apply, Build, Choose, Construct, Develop, Experiment with, Identify, Interview, Make use of, Model, Organize, Plan, Select, Solve, Utilize
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">
                      Analyze, Assume, Categorize, Classify, Compare, Conclusion, Contrast, Discover, Dissect, Distinguish, Divide, Examine, Function, Inference, Inspect, List, Motive, Relationships, Simplify, Survey, Take part in, Test for, Theme
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">
                      Agree, Appraise, Assess, Award, Choose, Compare, Conclude, Criteria, Criticize, Decide, Deduct, Defend, Determine, Disprove, Estimate, Evaluate, Explain, Importance, Influence, Interpret, Judge, Justify, Mark, Measure, Opinion, Perceive, Prioritize, Prove, Rate, Recommend, Rule on, Select, Support, Value
                    </td>
                    <td className="border border-gray-300 p-3 text-sm">
                      Adapt, Build, Change, Choose, Combine, Compile, Compose, Construct, Create, Delete, Design, Develop, Discuss, Elaborate, Estimate, Formulate, Happen, Imagine, Improve, Invent, Make up, Maximize, Minimize, Modify, Original, Originate, Plan, Predict, Propose, Solution, Solve, Suppose, Test, Theory
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-600 text-center mt-4">
              Anderson, L. W., & Krathwohl, D. R. (2001). A taxonomy for learning, teaching, and assessing, Abridged Edition. Boston, MA: Allyn and Bacon.
            </p>
          </div>
        </div>

        {showDownload && (
          <div className="absolute top-20 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-lg shadow-lg">
            ✓ Download started!
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuestionPaperBuilder({ onBackToHome }) {
  const { paperDetails, selectedQuestions, addQuestion, removeQuestion } = useQuestionPaper();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState(null);

  console.log('🎯 QuestionPaperBuilder - paperDetails:', paperDetails);
  console.log('🎯 Course Code being used:', paperDetails?.courseCode);
  console.log('🎯 Selected Questions:', selectedQuestions);

  if (!paperDetails) {
    console.warn('⚠️ No paperDetails available');
    return null;
  }

  const handleDragStart = (question) => {
    console.log('🖱️ Drag started for question:', question);
    setDraggedQuestion(question);
  };

  const handleDrop = () => {
    if (draggedQuestion) {
      console.log('📥 Question dropped:', draggedQuestion);
      
      // Check if question already exists
      const isDuplicate = selectedQuestions.some(q => q.id === draggedQuestion.id);
      
      if (isDuplicate) {
        console.warn('⚠️ Duplicate question detected');
        alert('This question has already been added to the template!');
        setDraggedQuestion(null);
        return;
      }

      // Determine part based on marks
      const part = getPartForMarks(draggedQuestion.marks);
      const questionNumber = `${selectedQuestions.length + 1}`;

      // Create template question with all properties from database
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
    if (marks === 2) return 'A';      // Part A: 2 marks (Questions 1-10)
    if (marks === 13) return 'B';     // Part B: 13 marks (Questions 11a/b-15a/b)
    if (marks === 15) return 'C';     // Part C: 15 marks (Questions 16a/b)
    
    // Fallback for any other marks
    if (marks <= 2) return 'A';
    if (marks <= 13) return 'B';
    return 'C';
  };

  const handlePrint = () => {
    console.log('🖨️ Opening print preview');
    setShowPreviewModal(true);
  };

  const handleBackToDashboard = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/dashboard';
    }
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
      
      {/* Content with relative positioning */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header - UPDATED: Light background with thin border */}
        <div className="bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 p-4 border-b-2 border-blue-400 shadow-md print:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Back to Dashboard Button */}
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md group"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              
              {/* College name box - width reduced */}
              <div className="max-w-lg">
                <h1 className="text-2xl font-bold text-gray-800">Government College of Engineering</h1>
                <p className="text-sm text-gray-700 mt-1">
                  {paperDetails.courseCode} - {paperDetails.courseName}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex gap-6">
            {/* Question Bank - 30% width */}
            <div className="w-[30%] h-full print:hidden">
              <QuestionBank
                courseCode={paperDetails.courseCode}
                onDragStart={handleDragStart}
                selectedQuestionIds={selectedQuestions.map(q => q.id)}
                onAddQuestion={() => setShowAddModal(true)}
              />
            </div>

            {/* Question Paper Template - 70% width */}
            <div className="w-[70%] h-full print:w-full">
              <QuestionPaperTemplate
                paperDetails={paperDetails}
                selectedQuestions={selectedQuestions}
                onQuestionRemove={removeQuestion}
                onAddQuestion={() => setShowAddModal(true)}
                onViewSyllabus={() => setShowSyllabusModal(true)}
                onPreview={() => setShowPreviewModal(true)}
                onDrop={handleDrop}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showInstructionModal && (
        <InstructionModal onClose={() => setShowInstructionModal(false)} />
      )}

      {showAddModal && (
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

      {/* Print Styles */}
      <style>
        {`
          @media print {
            /* Hide non-printable elements */
            .bg-gradient-to-r,
            button,
            .print\\:hidden {
              display: none !important;
            }
            
            /* Hide Question Bank */
            .w-\\[30\\%\\] {
              display: none !important;
            }
            
            /* Hide background */
            .absolute.inset-0 {
              display: none !important;
            }
            
            /* Full width for template */
            .w-\\[70\\%\\],
            .print\\:w-full {
              width: 100% !important;
            }
            
            /* Remove padding */
            .p-6 {
              padding: 0 !important;
            }
            
            /* Clean background */
            body {
              background: white !important;
            }
            
            /* Ensure images print */
            img {
              max-width: 100% !important;
              page-break-inside: avoid !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Page breaks */
            .print\\:break-inside-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Better print quality */
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