import { Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function TemplateQuestionList({ questions = [], onRemove = () => {}, onDrop = () => {} }) {
  // Pre-defined slots for each part
  const [partASlots, setPartASlots] = useState(Array(10).fill(null));
  const [partBSlots, setPartBSlots] = useState(Array(10).fill(null));
  const [partCSlots, setPartCSlots] = useState(Array(2).fill(null));

  const [dragOverSlot, setDragOverSlot] = useState({ part: null, index: null });

  // Organize questions into their respective slots
  useEffect(() => {
    const newPartA = Array(10).fill(null);
    const newPartB = Array(10).fill(null);
    const newPartC = Array(2).fill(null);

    questions.forEach(question => {
      const questionNum = question.questionNumber?.toString() || '';
      
      if (question.marks === 2 || question.part === 'A') {
        const num = parseInt(questionNum);
        if (num >= 1 && num <= 10) {
          newPartA[num - 1] = question;
        }
      } else if (question.marks === 13 || question.part === 'B') {
        if (questionNum.includes('a') || questionNum.includes('b')) {
          const baseNum = parseInt(questionNum);
          const isB = questionNum.includes('b');
          const slotIndex = ((baseNum - 11) * 2) + (isB ? 1 : 0);
          if (slotIndex >= 0 && slotIndex < 10) {
            newPartB[slotIndex] = question;
          }
        }
      } else if (question.marks === 15 || question.part === 'C') {
        if (questionNum.includes('a')) {
          newPartC[0] = question;
        } else if (questionNum.includes('b')) {
          newPartC[1] = question;
        }
      }
    });

    setPartASlots(newPartA);
    setPartBSlots(newPartB);
    setPartCSlots(newPartC);
  }, [questions]);

  const handleDragOver = (e, part, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot({ part, index });
  };

  const handleDragLeave = () => {
    setDragOverSlot({ part: null, index: null });
  };

  const handleSlotDrop = (e, part, slotIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call parent's onDrop with specific slot information
    if (onDrop) {
      onDrop(part, slotIndex);
    }
    
    setDragOverSlot({ part: null, index: null });
  };

  // Get question number label
  const getQuestionLabel = (part, index) => {
    if (part === 'A') {
      return `${index + 1}`;
    } else if (part === 'B') {
      const questionNum = 11 + Math.floor(index / 2);
      const choice = index % 2 === 0 ? 'a' : 'b';
      return `${questionNum}${choice}`;
    } else if (part === 'C') {
      const choice = index === 0 ? 'a' : 'b';
      return `16${choice}`;
    }
    return '';
  };

  // Check if we need OR separator
  const showOrSeparator = (part, index) => {
    if (part === 'B') {
      return index % 2 === 0 && index < partBSlots.length - 1;
    } else if (part === 'C') {
      return index === 0;
    }
    return false;
  };

  const QuestionSlot = ({ question, part, slotIndex, marks }) => {
    const isOver = dragOverSlot.part === part && dragOverSlot.index === slotIndex;
    const questionLabel = getQuestionLabel(part, slotIndex);
    
    return (
      <div
        onDragOver={(e) => handleDragOver(e, part, slotIndex)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleSlotDrop(e, part, slotIndex)}
        className={`min-h-[80px] border-2 rounded-lg p-3 transition-all ${
          isOver 
            ? 'border-blue-500 bg-blue-50 scale-[1.01] shadow-lg' 
            : question 
              ? 'border-l-4 border-blue-500 bg-gray-50 hover:bg-gray-100' 
              : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
        }`}
      >
        {question ? (
          <div className="group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-gray-700 text-sm">
                    {questionLabel}.
                  </span>
                  <div className="flex gap-1.5 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      Unit {question.unit}
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                      {question.marks} Marks
                    </span>
                    <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                      {question.bloom}
                    </span>
                  </div>
                </div>

                {/* Question Image */}
                {question.imageUrl && (
                  <div className="my-2 border border-gray-300 rounded overflow-hidden bg-white p-1.5">
                    <img
                      src={question.imageUrl}
                      alt={`Question ${questionLabel} diagram`}
                      className="max-w-full h-auto max-h-48 mx-auto object-contain"
                      onError={(e) => {
                        const container = e.currentTarget.parentElement;
                        if (container) container.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Question Text */}
                <p className="text-gray-800 leading-relaxed ml-5 text-sm">
                  {question.questionText}
                </p>

                <div className="flex gap-3 text-xs text-gray-500 mt-1.5 ml-5">
                  <span>CO: {question.courseOutcome}</span>
                  <span>PO: {question.programOutcome}</span>
                </div>
              </div>

              <button
                onClick={() => onRemove(question.id)}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1.5"
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[60px]">
            <div className="text-center">
              <div className="text-xs font-semibold mb-0.5">Question {questionLabel}</div>
              <div className="text-xs opacity-75">({marks} marks)</div>
              <div className="text-xs mt-1 opacity-60">Empty - Drag question here</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Part A - Changed header styling */}
      <div>
        <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2 font-semibold text-gray-800 text-sm">
          <center> PART A - Answer ALL Questions </center> 
        </div>
        <div className="border-2 border-gray-300 rounded-b-lg p-3 bg-white">
          <div className="space-y-2.5">
            {partASlots.map((question, index) => (
              <QuestionSlot
                key={`part-a-${index}`}
                question={question}
                part="A"
                slotIndex={index}
                marks={2}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Part B - Changed header styling */}
      <div>
        <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2 font-semibold text-gray-800 text-sm">
         <center> PART B - Answer ALL Questions </center> 
        </div>
        <div className="border-2 border-gray-300 rounded-b-lg p-3 bg-white space-y-3">
          {partBSlots.map((question, index) => (
            <React.Fragment key={`part-b-${index}`}>
              <QuestionSlot
                question={question}
                part="B"
                slotIndex={index}
                marks={13}
              />
              {showOrSeparator('B', index) && (
                <div className="text-center font-bold text-gray-700 py-1.5 text-base">
                  OR
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Part C - Changed header styling */}
      <div>
        <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2 font-semibold text-gray-800 text-sm">
          <center> PART C - Answer ALL Questions </center> 
        </div>
        <div className="border-2 border-gray-300 rounded-b-lg p-3 bg-white space-y-3">
          {partCSlots.map((question, index) => (
            <React.Fragment key={`part-c-${index}`}>
              <QuestionSlot
                question={question}
                part="C"
                slotIndex={index}
                marks={15}
              />
              {showOrSeparator('C', index) && (
                <div className="text-center font-bold text-gray-700 py-1.5 text-base">
                  OR
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

TemplateQuestionList.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    part: PropTypes.string,
    unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bloom: PropTypes.string,
    imageUrl: PropTypes.string,
    questionNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    questionText: PropTypes.string,
    courseOutcome: PropTypes.string,
    programOutcome: PropTypes.string,
  })).isRequired,
  onRemove: PropTypes.func.isRequired,
  onDrop: PropTypes.func,
};