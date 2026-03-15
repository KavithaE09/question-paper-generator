import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuestionPaperProvider, useQuestionPaper } from './context/QuestionPaperContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard'; // ✅ Import Admin Dashboard
import DepartmentSelection from './components/DepartmentSelection';
import QuestionPaperDetailsForm from './components/QuestionPaperDetailsForm';
import QuestionPaperBuilder from './pages/QuestionPaperBuilder';

function AppContent() {
  const [step, setStep] = useState('login');
  const [tempDepartment, setTempDepartment] = useState('');
  const [tempCourseCode, setTempCourseCode] = useState('');
  const [tempCourseName, setTempCourseName] = useState('');
  const [currentPaperId, setCurrentPaperId] = useState(null);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const { user } = useAuth();
  const { setPaperDetails, setSelectedQuestions, loadPaper, clearTemplate } = useQuestionPaper();

  useEffect(() => {
    console.log('Current step:', step);
    console.log('User:', user);
    console.log('User role:', user?.role);
    console.log('Read-only mode:', isReadOnlyMode);

    // ✅ Initial redirection logic
    if (user && step === 'login') {
      if (user.role === 'admin') {
        setStep('admin-dashboard');
      } else {
        setStep('dashboard');
      }
    }
  }, [step, user, isReadOnlyMode]);

  // ✅ Prevent Admin from accessing creation steps
  useEffect(() => {
    if (user?.role === 'admin' && ['department', 'details'].includes(step)) {
      setStep('admin-dashboard');
    }
  }, [user, step]);

  // ✅ Handle auth success with role-based routing
  const handleAuthSuccess = () => {
    console.log('Auth success, navigating to dashboard');
    console.log('User role:', user?.role);

    // Route based on role
    if (user?.role === 'admin') {
      setStep('admin-dashboard');
    } else {
      setStep('dashboard');
    }
  };

  const handleCreateNew = () => {
    // ✅ Guard: Admin cannot create papers
    if (user?.role === 'admin') {
      console.warn('❌ Admins are not allowed to create papers');
      return;
    }

    console.log('Creating new paper...');
    clearTemplate();
    setCurrentPaperId(null);
    setIsReadOnlyMode(false);
    setStep('department');
    console.log('Step changed to:', 'department');
  };

  const handleOpenPaper = async (paperId, draftData = null, isCompleted = false) => {
    console.log('📂 Opening paper:', paperId);

    // ✅ For Admin or specific view requests, ensure read-only
    const readOnly = isCompleted || user?.role === 'admin';

    if (draftData) {
      console.log('✅ Loading paper with provided data');
      setCurrentPaperId(paperId);
      setPaperDetails(draftData.paperDetails);
      setSelectedQuestions(draftData.selectedQuestions);
      setIsReadOnlyMode(readOnly);
      setStep('builder');
    } else {
      console.log('📄 Fetching paper details from backend...');
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API}/api/questions/load-draft/${paperId}`);

        if (response.ok) {
          const data = await response.json();
          setCurrentPaperId(paperId);
          setPaperDetails(data.paperDetails);
          setSelectedQuestions(data.selectedQuestions);
          setIsReadOnlyMode(readOnly);
          setStep('builder');
          console.log('✅ Paper loaded from backend');
        } else {
          console.error('❌ Failed to load paper from backend');
          // Fallback to local (though unlikely to work for Admin)
          loadPaper(paperId);
          setCurrentPaperId(paperId);
          setIsReadOnlyMode(readOnly);
          setStep('builder');
        }
      } catch (err) {
        console.error('❌ Error fetching paper:', err);
      }
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
    setCurrentPaperId(null);
    setIsReadOnlyMode(false);
    setStep('builder');
  };

  // ✅ Handle back to dashboard with role check
  const handleBackToDashboard = () => {
    console.log('Navigating back to dashboard');
    setIsReadOnlyMode(false);

    // Route based on role
    if (user?.role === 'admin') {
      setStep('admin-dashboard');
    } else {
      setStep('dashboard');
    }
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

  // ✅ Faculty Dashboard
  if (step === 'dashboard') {
    return (
      <Dashboard
        onCreateNew={handleCreateNew}
        onOpenPaper={handleOpenPaper}
      />
    );
  }

  // ✅ Admin Dashboard
  if (step === 'admin-dashboard') {
    return (
      <AdminDashboard
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
        isReadOnly={isReadOnlyMode}
      />
    );
  }

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