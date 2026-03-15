import { useState, useEffect, useRef } from 'react';

export function useAutoSave(data, delay = 3000) {
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [paperId, setPaperId] = useState(null);
  const timeoutRef = useRef(null);
  const lastDataRef = useRef(null);

  const saveData = async () => {
    // ✅ Guard: skip save if userId is not available yet
    if (!data.userId) {
      console.warn('⚠️ Auto-save skipped: no userId available');
      return;
    }

    try {
      setSaveStatus('saving');
      console.log('💾 Auto-saving...', {
        userId: data.userId,
        userRole: data.userRole,
        paperId: paperId
      });

      const response = await fetch('http://localhost:5000/api/questions/auto-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.userId,
          userRole: data.userRole,
          paperDetails: data.paperDetails,
          selectedQuestions: data.selectedQuestions,
          paperId: paperId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Auto-save successful:', result);
        
        if (result.paperId && !paperId) {
          setPaperId(result.paperId);
          console.log('📝 Paper ID set:', result.paperId);
        }
        
        setSaveStatus('saved');
        setLastSaved(new Date());
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('❌ Auto-save error:', error);
      setSaveStatus('error');
    }
  };

  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  };

  useEffect(() => {
    const currentData = JSON.stringify({
      paperDetails: data.paperDetails,
      selectedQuestions: data.selectedQuestions,
    });

    if (lastDataRef.current !== currentData) {
      lastDataRef.current = currentData;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveData();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data.paperDetails, data.selectedQuestions, data.userId, data.userRole]);

  return { saveStatus, lastSaved, paperId, forceSave };
}