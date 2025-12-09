import { createContext, useContext, useState } from 'react';

const QuestionPaperContext = createContext();

export function QuestionPaperProvider({ children }) {
  const [paperDetails, setPaperDetails] = useState({
    department: '',
    courseCode: '',
    courseName: '',
    academicYear: '',
    semester: '',
    year: '',
    regulation: '',
    examType: '',
    examDate: '',
    registerNumber: ''
  });

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentPaperId, setCurrentPaperId] = useState(null);

  // Clear all template data
  const clearTemplate = () => {
    console.log('Clearing template...');
    setPaperDetails({
      department: '',
      courseCode: '',
      courseName: '',
      academicYear: '',
      semester: '',
      year: '',
      regulation: '',
      examType: '',
      examDate: '',
      registerNumber: ''
    });
    setSelectedQuestions([]);
    setCurrentPaperId(null);
  };

  // Load existing paper
  const loadPaper = (paperId) => {
    console.log('Loading paper:', paperId);
    try {
      const papers = localStorage.getItem('questionPapers');
      if (papers) {
        const allPapers = JSON.parse(papers);
        const paper = allPapers.find(p => p.id === paperId);
        
        if (paper) {
          setPaperDetails({
            department: paper.department || '',
            courseCode: paper.courseCode || '',
            courseName: paper.courseName || '',
            academicYear: paper.academicYear || '',
            semester: paper.semester || '',
            year: paper.year || '',
            regulation: paper.regulation || '',
            examType: paper.examType || paper.testType || '',
            examDate: paper.examDate || '',
            registerNumber: paper.registerNumber || ''
          });
          setSelectedQuestions(paper.questions || []);
          setCurrentPaperId(paperId);
          console.log('Paper loaded successfully');
        } else {
          console.error('Paper not found');
        }
      }
    } catch (error) {
      console.error('Error loading paper:', error);
    }
  };

  // Save paper
  const savePaper = () => {
    console.log('Saving paper...');
    try {
      const papers = localStorage.getItem('questionPapers');
      const allPapers = papers ? JSON.parse(papers) : [];
      
      const paperData = {
        id: currentPaperId || `paper_${Date.now()}`,
        ...paperDetails,
        testType: paperDetails.examType,
        questions: selectedQuestions,
        created: new Date().toLocaleDateString(),
        updated: new Date().toLocaleDateString()
      };

      if (currentPaperId) {
        // Update existing paper
        const index = allPapers.findIndex(p => p.id === currentPaperId);
        if (index !== -1) {
          allPapers[index] = paperData;
        }
      } else {
        // Add new paper
        allPapers.push(paperData);
        setCurrentPaperId(paperData.id);
      }

      localStorage.setItem('questionPapers', JSON.stringify(allPapers));
      console.log('Paper saved successfully');
      return paperData.id;
    } catch (error) {
      console.error('Error saving paper:', error);
      return null;
    }
  };

  // Add question to paper
  const addQuestion = (question) => {
    setSelectedQuestions(prev => [...prev, question]);
  };

  // Remove question from paper
  const removeQuestion = (questionId) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  // Update question in paper
  const updateQuestion = (questionId, updatedQuestion) => {
    setSelectedQuestions(prev =>
      prev.map(q => q.id === questionId ? updatedQuestion : q)
    );
  };

  const value = {
    paperDetails,
    setPaperDetails,
    selectedQuestions,
    setSelectedQuestions,
    currentPaperId,
    setCurrentPaperId,
    clearTemplate,
    loadPaper,
    savePaper,
    addQuestion,
    removeQuestion,
    updateQuestion
  };

  return (
    <QuestionPaperContext.Provider value={value}>
      {children}
    </QuestionPaperContext.Provider>
  );
}

export function useQuestionPaper() {
  const context = useContext(QuestionPaperContext);
  if (!context) {
    throw new Error('useQuestionPaper must be used within a QuestionPaperProvider');
  }
  return context;
}