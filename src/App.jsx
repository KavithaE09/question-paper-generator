import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuestionPaperProvider, useQuestionPaper } from './context/QuestionPaperContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import DepartmentSelection from './components/DepartmentSelection';
import QuestionPaperDetailsForm from './components/QuestionPaperDetailsForm';
import QuestionPaperBuilder from './pages/QuestionPaperBuilder';

function AppContent() {
  const [step, setStep] = useState('login');
  const [tempDepartment, setTempDepartment] = useState('');
  const [tempCourseCode, setTempCourseCode] = useState('');
  const [tempCourseName, setTempCourseName] = useState('');
  const [currentPaperId, setCurrentPaperId] = useState(null);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false); // 🆕 Track if paper is read-only
  const { user } = useAuth();
  const { setPaperDetails, setSelectedQuestions, loadPaper, clearTemplate } = useQuestionPaper();

  // Debug: Log when step changes
  useEffect(() => {
    console.log('Current step:', step);
    console.log('User:', user);
    console.log('Read-only mode:', isReadOnlyMode);
  }, [step, user, isReadOnlyMode]);

  const handleAuthSuccess = () => {
    console.log('Auth success, navigating to dashboard');
    setStep('dashboard');
  };

  const handleCreateNew = () => {
    console.log('Creating new paper...');
    clearTemplate();
    setCurrentPaperId(null);
    setIsReadOnlyMode(false); // 🆕 New papers are editable
    setStep('department');
    console.log('Step changed to:', 'department');
  };

  // 🆕 UPDATED: Handle opening both drafts and completed papers with read-only flag
  const handleOpenPaper = (paperId, draftData = null, isCompleted = false) => {
    console.log('📂 Opening paper:', paperId);
    console.log('📄 Draft data:', draftData);
    console.log('🔒 Is completed (read-only):', isCompleted);
    
    if (draftData) {
      // Loading a draft/completed paper from backend
      console.log('✅ Loading paper with data:', draftData);
      
      setCurrentPaperId(draftData.paperId || paperId);
      setPaperDetails(draftData.paperDetails);
      setSelectedQuestions(draftData.selectedQuestions);
      setIsReadOnlyMode(isCompleted); // 🆕 Set read-only mode based on completion status
      setStep('builder');
      
      console.log('✅ Paper loaded successfully. Read-only:', isCompleted);
    } else {
      // Fallback: Loading from localStorage (legacy support)
      console.log('📄 Loading from localStorage');
      loadPaper(paperId);
      setCurrentPaperId(paperId);
      setIsReadOnlyMode(false); // Assume editable for localStorage papers
      setStep('builder');
    }
  };

  const handleDepartmentNext = (department, courseCode, courseName) => {
    console.log('Department selected:', { department, courseCode, courseName });
    setTempDepartment(department);
    setTempCourseCode(courseCode);
    setTempCourseName(courseName);
    setStep('details');
  };

  const handleDetailsNext = (details) => {
    console.log('Details submitted:', details);
    setPaperDetails(details);
    setCurrentPaperId(null); // New paper, no ID yet
    setIsReadOnlyMode(false); // 🆕 New papers are always editable
    setStep('builder');
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    console.log('Navigating back to dashboard');
    setIsReadOnlyMode(false); // 🆕 Reset read-only mode
    setStep('dashboard');
  };

  // If no user and step is not login/signup, redirect to login
  if (!user && step !== 'login' && step !== 'signup') {
    console.log('No user found, redirecting to login');
    setStep('login');
    return null;
  }

  if (!user && step === 'login') {
    return <Login onToggle={() => setStep('signup')} onSuccess={handleAuthSuccess} />;
  }

  if (!user && step === 'signup') {
    return <Signup onToggle={() => setStep('login')} onSuccess={handleAuthSuccess} />;
  }

  if (step === 'dashboard') {
    return (
      <Dashboard
        onCreateNew={handleCreateNew}
        onOpenPaper={handleOpenPaper}
      />
    );
  }

  if (step === 'department') {
    return (
      <DepartmentSelection 
        onNext={handleDepartmentNext}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (step === 'details') {
    return (
      <QuestionPaperDetailsForm
        department={tempDepartment}
        courseCode={tempCourseCode}
        courseName={tempCourseName}
        onNext={handleDetailsNext}
        onBack={() => setStep('department')}
      />
    );
  }

  if (step === 'builder') {
    return (
      <QuestionPaperBuilder 
        onBackToHome={handleBackToDashboard}
        paperId={currentPaperId}
        isReadOnly={isReadOnlyMode} // 🆕 Pass read-only flag to builder
      />
    );
  }

  // Fallback - should never reach here
  console.error('Unknown step:', step);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error: Unknown page state</h1>
        <button 
          onClick={handleBackToDashboard}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <QuestionPaperProvider>
        <AppContent />
      </QuestionPaperProvider>
    </AuthProvider>
  );
}

export default App;