// QuestionPaperTemplate.jsx

import { useState } from 'react';
import { Home } from 'lucide-react';
import TemplateHeader from './TemplateHeader';
import TemplateQuestionList from './TemplateQuestionList';
import TemplateFooter from './TemplateFooter';

export default function QuestionPaperTemplate({
  paperDetails,
  selectedQuestions,
  onQuestionRemove,
  onDrop,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [showConsolidation, setShowConsolidation] = useState(true);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onDrop();
  };

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* TemplateHeader - Top position (pink line area) */}
        <TemplateHeader paperDetails={paperDetails} />

        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[400px] border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            {selectedQuestions.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-lg font-semibold mb-2">Drop questions here</div>
                <div className="text-sm">Drag questions from the Question Bank to build your paper</div>
              </div>
            ) : (
              <>
                <TemplateQuestionList
                  questions={selectedQuestions}
                  onRemove={onQuestionRemove}
                />
                
                {/* Consolidation Tables Footer */}
                {showConsolidation && (
                  <TemplateFooter questions={selectedQuestions} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total Questions: {selectedQuestions.length} | Total Marks: {totalMarks}
        </div>
        
        {/* Checkbox for Consolidation Tables */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showConsolidation"
            checked={showConsolidation}
            onChange={(e) => setShowConsolidation(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label 
            htmlFor="showConsolidation" 
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Include Consolidation Tables
          </label>
        </div>
      </div>
    </div>
  );
}