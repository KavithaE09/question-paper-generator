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
  const { user } = useAuth();
  const { setPaperDetails, loadPaper, clearTemplate } = useQuestionPaper();

  // Debug: Log when step changes
  useEffect(() => {
    console.log('Current step:', step);
    console.log('User:', user);
  }, [step, user]);

  const handleAuthSuccess = () => {
    console.log('Auth success, navigating to dashboard');
    setStep('dashboard');
  };

  const handleCreateNew = () => {
    console.log('Creating new paper...');
    clearTemplate();
    setStep('department');
    console.log('Step changed to:', 'department');
  };

  const handleOpenPaper = (paperId) => {
    console.log('Opening paper:', paperId);
    loadPaper(paperId);
    setStep('builder');
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
    setStep('builder');
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    console.log('Navigating back to dashboard');
    setStep('dashboard');
  };

  // If no user and step is not login/signup, redirect to login
  if (!user && step !== 'login' && step !== 'signup') {
    console.log('No user found, redirecting to login');
    setStep('login');
    return null;
  }

  if (!user && step === 'login') {
    return <Login onSignupClick={() => setStep('signup')} onSuccess={handleAuthSuccess} />;
  }

  if (!user && step === 'signup') {
    return <Signup onLoginClick={() => setStep('login')} onSuccess={handleAuthSuccess} />;
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
        onBack={handleBackToDashboard}
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