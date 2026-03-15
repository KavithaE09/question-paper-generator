import { Trash2 } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';

export default function TemplateQuestionList({ questions = [], onRemove = () => {} }) {
  // Separate questions by marks
  const partAQuestions = questions.filter(q => parseInt(q.marks) === 2);
  const partBQuestions = questions.filter(q => parseInt(q.marks) === 13);
  const partCQuestions = questions.filter(q => parseInt(q.marks) === 15);

  const QuestionCard = ({ question, questionNumber }) => {
    return (
      <div className="border-2 border-l-4 border-blue-500 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-all group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-gray-700 text-sm">
                {questionNumber}.
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
                  alt={`Question ${questionNumber} diagram`}
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
    );
  };

  return (
    <div className="space-y-5">
      {/* Part A */}
      <div>
        <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2 font-semibold text-gray-800 text-sm">
          <center>PART A - Answer ALL Questions (2 Marks)</center>
        </div>
        <div className="border-2 border-gray-300 rounded-b-lg p-3 bg-white">
          {partAQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No questions added yet</p>
              <p className="text-xs mt-1">Add 2-mark questions to Part A</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {partAQuestions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Part B */}
      <div>
        <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2 font-semibold text-gray-800 text-sm">
          <center>PART B - Answer ALL Questions (13 Marks)</center>
        </div>
        <div className="border-2 border-gray-300 rounded-b-lg p-3 bg-white">
          {partBQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No questions added yet</p>
              <p className="text-xs mt-1">Add 13-mark questions to Part B</p>
            </div>
          ) : (
            <div className="space-y-3">
              {partBQuestions.map((question, index) => {
                const questionNum = 11 + Math.floor(index / 2);
                const choice = index % 2 === 0 ? 'a' : 'b';
                const showOr = index % 2 === 0 && index < partBQuestions.length - 1;

                return (
                  <React.Fragment key={question.id}>
                    <QuestionCard
                      question={question}
                      questionNumber={`${questionNum}${choice}`}
                    />
                    {showOr && (
                      <div className="text-center font-bold text-gray-700 py-1.5 text-base">
                        OR
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Part C */}
      <div>
        <div className="bg-gray-100 border-l-4 border-gray-400 px-4 py-2 font-semibold text-gray-800 text-sm">
          <center>PART C - Answer ALL Questions (15 Marks)</center>
        </div>
        <div className="border-2 border-gray-300 rounded-b-lg p-3 bg-white">
          {partCQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No questions added yet</p>
              <p className="text-xs mt-1">Add 15-mark questions to Part C</p>
            </div>
          ) : (
            <div className="space-y-3">
              {partCQuestions.map((question, index) => {
                const choice = index === 0 ? 'a' : 'b';
                const showOr = index === 0 && partCQuestions.length > 1;

                return (
                  <React.Fragment key={question.id}>
                    <QuestionCard
                      question={question}
                      questionNumber={`16${choice}`}
                    />
                    {showOr && (
                      <div className="text-center font-bold text-gray-700 py-1.5 text-base">
                        OR
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
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
};