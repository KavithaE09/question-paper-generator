import { X, Printer } from 'lucide-react';
import { useState } from 'react';
import TemplateHeader from '../Template/TemplateHeader';
import TemplateFooter from '../Template/TemplateFooter';

export default function PreviewModal({ paperDetails, questions, onClose }) {
  const [includeConsolidation, setIncludeConsolidation] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.part]) {
      acc[question.part] = [];
    }
    acc[question.part].push(question);
    return acc;
  }, {});

  // Helper function to get question number
  const getQuestionNumber = (part, index) => {
    if (part === 'A') {
      return `${index + 1}`;
    } else if (part === 'B') {
      const qNum = 11 + Math.floor(index / 2);
      const choice = index % 2 === 0 ? 'a' : 'b';
      return `${qNum}${choice}`;
    } else if (part === 'C') {
      const choice = index % 2 === 0 ? 'a' : 'b';
      return `16${choice}`;
    }
    return `${index + 1}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <h2 className="text-2xl font-bold">Preview Question Paper</h2>
          <div className="flex items-center space-x-4">
            {/* Checkbox for Consolidation Tables */}
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <input
                type="checkbox"
                id="includeConsolidation"
                checked={includeConsolidation}
                onChange={(e) => setIncludeConsolidation(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label 
                htmlFor="includeConsolidation" 
                className="text-sm font-medium text-white cursor-pointer select-none"
              >
                Include Consolidation Tables
              </label>
            </div>

            <button
              onClick={handlePrint}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-green-50 transition"
            >
              <Printer className="w-4 h-4 mr-2" />
              PRINT
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" id="printable-content">
            <TemplateHeader paperDetails={paperDetails} />

            <div className="mt-6 space-y-6">
              {Object.entries(groupedQuestions).map(([part, partQuestions]) => {
                const partMarks = partQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
                return (
                  <div key={part} className="border-b pb-4">
                    <h4 className="text-lg font-bold mb-2">
                      PART - {part} ({partMarks} Marks)
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 italic">Answer ALL Questions</p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-3 py-2 text-left w-16">Q.No</th>
                            <th className="border border-gray-400 px-3 py-2 text-left">Question</th>
                            <th className="border border-gray-400 px-3 py-2 text-center w-24">
                              Max<br />Marks
                            </th>
                            <th className="border border-gray-400 px-3 py-2 text-center w-16">CO</th>
                            <th className="border border-gray-400 px-3 py-2 text-center w-16">BL</th>
                            <th className="border border-gray-400 px-3 py-2 text-center w-16">KC</th>
                            <th className="border border-gray-400 px-3 py-2 text-center w-16">PI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partQuestions.map((question, index) => (
                            <tr key={question.id}>
                              <td className="border border-gray-400 px-3 py-3 text-center font-semibold">
                                {getQuestionNumber(part, index)}
                              </td>
                              <td className="border border-gray-400 px-3 py-3">
                                {/* Display image if exists */}
                                {question.imageUrl && (
                                  <div className="mb-2">
                                    <img 
                                      src={question.imageUrl} 
                                      alt={`Question ${getQuestionNumber(part, index)} diagram`}
                                      className="max-w-full h-auto max-h-32 mx-auto object-contain border border-gray-300 rounded"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                {/* Display question text */}
                                {question.questionText}
                              </td>
                              <td className="border border-gray-400 px-3 py-3 text-center">
                                {question.marks}
                              </td>
                              <td className="border border-gray-400 px-3 py-3 text-center">
                                {question.courseOutcome}
                              </td>
                              <td className="border border-gray-400 px-3 py-3 text-center">
                                {question.bloom}
                              </td>
                              <td className="border border-gray-400 px-3 py-3 text-center">
                                {/* KC - Knowledge Category based on unit */}
                                {question.unit === 1 ? 'F' : 
                                 question.unit === 2 ? 'C' : 
                                 question.unit === 3 ? 'P' : 
                                 question.unit >= 4 ? 'M' : 'C'}
                              </td>
                              <td className="border border-gray-400 px-3 py-3 text-center">
                                {question.pi || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Consolidation Tables - Only show if checkbox is checked */}
            {includeConsolidation && (
              <TemplateFooter questions={questions} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}