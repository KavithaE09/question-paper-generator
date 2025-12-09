// QuestionCard.jsx - Updated with RED styling for added questions

export default function QuestionCard({ question, onDragStart, isSelected }) {
  return (
    <div
      draggable={!isSelected}
      onDragStart={onDragStart}
      className={`
        relative border-2 rounded-lg p-4 transition-all cursor-move
        ${isSelected 
          ? 'bg-red-50 border-red-300 opacity-75 cursor-not-allowed' 
          : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
        }
      `}
    >
      {/* Drag Handle Icon */}
      {!isSelected && (
        <div className="absolute top-2 left-2 text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-1 pl-6">
          {/* Question Text */}
          <p className={`text-sm mb-3 ${isSelected ? 'text-gray-600' : 'text-gray-800'}`}>
            {question.questionText}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
              Unit {question.unit}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
              {question.marks} Marks
            </span>
            {question.topic && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">
                {question.topic}
              </span>
            )}
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
              {question.bloom}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">
              CO: {question.courseOutcome}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">
              PO: {question.programOutcome}
            </span>
          </div>

          {/* Added Badge - RED STYLING */}
          {isSelected && (
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold border border-red-200">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Added
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for selected questions */}
      {isSelected && (
        <div className="absolute inset-0 bg-red-100 bg-opacity-20 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}