// src/hooks/useAutoSave.js
import { useEffect, useRef, useState } from 'react';

export const useAutoSave = (data, delay = 3000) => {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [lastSaved, setLastSaved] = useState(null);
  const [paperId, setPaperId] = useState(null);
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(JSON.stringify(data));
  const saveInProgressRef = useRef(false);
  const draftCheckedRef = useRef(false); // 🆕 Track if we checked for existing draft

  // 🆕 CHECK FOR EXISTING DRAFT when component mounts
  useEffect(() => {
    const checkExistingDraft = async () => {
      // Skip if already checked or missing required data
      if (draftCheckedRef.current || !data?.paperDetails?.courseCode || !data?.userId) {
        return;
      }

      try {
        const userId = data.userId || 1;
        const courseCode = data.paperDetails.courseCode;

        console.log('🔍 Checking for existing draft:', { userId, courseCode });

        const response = await fetch(`http://localhost:5000/api/questions/drafts/${userId}`);
        
        if (response.ok) {
          const drafts = await response.json();
          
          // 🎯 Find draft with SAME course code and draft status
          const existingDraft = drafts.find(draft => 
            draft.course_code === courseCode && draft.status === 'draft'
          );
          
          if (existingDraft) {
            setPaperId(existingDraft.id);
            setLastSaved(new Date(existingDraft.last_saved));
            console.log('✅ Found existing draft ID:', existingDraft.id, '- Will UPDATE this');
          } else {
            console.log('📝 No existing draft found - Will CREATE new');
          }
        }
        
        draftCheckedRef.current = true;
      } catch (error) {
        console.error('❌ Error checking existing draft:', error);
        draftCheckedRef.current = true;
      }
    };

    checkExistingDraft();
  }, [data?.paperDetails?.courseCode, data?.userId]);

  useEffect(() => {
    // Skip if no data
    if (!data || !data.selectedQuestions || !data.paperDetails) {
      console.log('⏭️ Skipping auto-save: Missing data');
      return;
    }

    // Skip if no questions selected yet
    if (data.selectedQuestions.length === 0) {
      console.log('⏭️ Skipping auto-save: No questions selected');
      return;
    }

    // Check if data actually changed
    const currentData = JSON.stringify({
      selectedQuestions: data.selectedQuestions,
      paperDetails: data.paperDetails
    });
    
    if (currentData === previousDataRef.current) {
      return;
    }

    // Skip if save already in progress
    if (saveInProgressRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    console.log('⏰ Setting auto-save timer...');
    setSaveStatus('saving');

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      saveInProgressRef.current = true;
      
      try {
        console.log('💾 Auto-saving...', {
          questionsCount: data.selectedQuestions.length,
          paperId: paperId,
          action: paperId ? '🔄 UPDATE' : '🆕 CREATE'
        });

        const response = await fetch('http://localhost:5000/api/questions/auto-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.userId || 1,
            paperDetails: data.paperDetails,
            selectedQuestions: data.selectedQuestions,
            paperId: paperId // 🎯 Send existing paperId if found
          })
        });

        const result = await response.json();

        if (result.success) {
          setSaveStatus('saved');
          setLastSaved(new Date());
          
          // Update previous data ref with only relevant data
          previousDataRef.current = JSON.stringify({
            selectedQuestions: data.selectedQuestions,
            paperDetails: data.paperDetails
          });
          
          // 🆕 Store paper ID ONLY if it's a new creation
          if (result.paperId && !paperId) {
            setPaperId(result.paperId);
            console.log('🆔 New draft created with ID:', result.paperId);
          }

          // Also save to localStorage as backup
          localStorage.setItem('questionPaper_draft', JSON.stringify({
            paperDetails: data.paperDetails,
            selectedQuestions: data.selectedQuestions,
            paperId: paperId || result.paperId,
            savedAt: new Date().toISOString()
          }));

          console.log('✅ Auto-save successful', paperId ? `(Updated ID: ${paperId})` : `(Created ID: ${result.paperId})`);
        } else {
          throw new Error(result.message || 'Save failed');
        }
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        setSaveStatus('error');

        // Save to localStorage as fallback
        try {
          localStorage.setItem('questionPaper_backup', JSON.stringify({
            paperDetails: data.paperDetails,
            selectedQuestions: data.selectedQuestions,
            savedAt: new Date().toISOString(),
            error: true
          }));
          console.log('💾 Saved to localStorage as backup');
        } catch (lsError) {
          console.error('Failed to save to localStorage:', lsError);
        }
      } finally {
        saveInProgressRef.current = false;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, paperId]);

  // 🆕 UPDATED Method to manually trigger save
  const forceSave = async () => {
    if (!data || !data.selectedQuestions || !data.paperDetails) {
      return { success: false, message: 'No data to save' };
    }

    setSaveStatus('saving');
    saveInProgressRef.current = true;

    try {
      console.log('💾 Manual save triggered', {
        paperId: paperId,
        action: paperId ? '🔄 UPDATE' : '🆕 CREATE'
      });

      const response = await fetch('http://localhost:5000/api/questions/auto-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.userId || 1,
          paperDetails: data.paperDetails,
          selectedQuestions: data.selectedQuestions,
          paperId: paperId // 🎯 Send existing paperId
        })
      });

      const result = await response.json();

      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        // Store paper ID only if new
        if (result.paperId && !paperId) {
          setPaperId(result.paperId);
          console.log('🆔 Created with ID:', result.paperId);
        }
        
        return { 
          success: true, 
          paperId: paperId || result.paperId,
          action: paperId ? 'updated' : 'created'
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setSaveStatus('error');
      return { success: false, message: error.message };
    } finally {
      saveInProgressRef.current = false;
    }
  };

  return { 
    saveStatus, 
    lastSaved, 
    paperId,
    forceSave 
  };
};