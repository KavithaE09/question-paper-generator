import { useState, useEffect } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
import QuestionCard from './QuestionCard';

export default function QuestionBank({ courseCode, onDragStart, selectedQuestionIds, onAddQuestion }) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedMarks, setSelectedMarks] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [courseCode]);

  useEffect(() => {
    applyFilters();
  }, [questions, selectedUnit, selectedMarks, selectedTopic, searchTerm]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions?courseCode=${courseCode}`);
      const data = await response.json();
      console.log('Fetched questions:', data);
      
      // Transform snake_case to camelCase and include topic
      const transformedData = data.map((q) => ({
        id: q.id.toString(),
        unit: q.unit,
        marks: q.marks,
        questionText: q.question_text,
        bloom: q.bloom,
        courseOutcome: q.course_outcome,
        programOutcome: q.program_outcome,
        diagram: q.has_diagram,
        imageUrl: q.image_url || null,
        topic: q.topic || null
      }));
      
      setQuestions(transformedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    if (selectedUnit !== 'all') {
      filtered = filtered.filter(q => q.unit === selectedUnit);
    }

    if (selectedMarks !== 'all') {
      filtered = filtered.filter(q => q.marks === selectedMarks);
    }

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic === selectedTopic);
    }

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const markOptions = [2, 6, 7, 13, 15];
  const topicOptions = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Suggested Questions
          </h3>
          {onAddQuestion && (
            <button
              onClick={onAddQuestion}
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-md"
              title="Add New Question"
            >
              <Plus className="w-4 h-4" />
              ADD
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-b space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="all">All Units</option>
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
              <option value="3">Unit 3</option>
              <option value="4">Unit 4</option>
              <option value="5">Unit 5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Marks</label>
            <select
              value={selectedMarks}
              onChange={(e) => setSelectedMarks(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="all">All Marks</option>
              {markOptions.map(mark => (
                <option key={mark} value={mark}>{mark} Marks</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="all">All Topics</option>
              {topicOptions.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No questions found
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const isSelected = selectedQuestionIds.includes(question.id);
            return (
              <QuestionCard
                key={question.id}
                question={question}
                onDragStart={() => onDragStart(question)}
                isSelected={isSelected}
              />
            );
          })
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="text-sm text-gray-600">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>
      </div>
    </div>
  );
}