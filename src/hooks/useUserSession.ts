import { useState, useEffect, useCallback } from 'react';
import { Course, SavedResult, GraduationStatus } from '../types';

interface UseUserSessionReturn {
  // State
  matricNumber: string;
  isNewUser: boolean;
  savedResults: SavedResult[];
  showSaveDialog: boolean;
  
  // Actions
  login: (matric: string) => void;
  switchUser: () => void;
  saveResult: (courses: Course[], gpa: number, graduationStatus: Omit<GraduationStatus, 'icon'>) => void;
  setShowSaveDialog: (show: boolean) => void;
  loadCoursesForUser: () => Course[];
}

export function useUserSession(onCoursesLoaded?: (courses: Course[]) => void): UseUserSessionReturn {
  const [matricNumber, setMatricNumber] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Check for existing user on mount
  useEffect(() => {
    const savedMatric = localStorage.getItem('matricNumber');
    if (savedMatric) {
      setMatricNumber(savedMatric);
      setIsNewUser(false);
      
      // Load saved results
      const userResults = localStorage.getItem(`savedResults_${savedMatric}`);
      if (userResults) {
        const parsedResults = JSON.parse(userResults);
        setSavedResults(parsedResults);
        
        // Load most recent courses
        if (parsedResults.length > 0 && onCoursesLoaded) {
          const mostRecent = parsedResults[parsedResults.length - 1];
          onCoursesLoaded(mostRecent.courses);
        }
      } else {
        // Check legacy storage
        const allResults = localStorage.getItem('savedResults');
        if (allResults) {
          const userResultsFromGlobal = JSON.parse(allResults)
            .filter((r: SavedResult) => r.matricNumber === savedMatric);
          if (userResultsFromGlobal.length > 0) {
            setSavedResults(userResultsFromGlobal);
            if (onCoursesLoaded) {
              const mostRecent = userResultsFromGlobal[userResultsFromGlobal.length - 1];
              onCoursesLoaded(mostRecent.courses);
            }
          }
        }
      }
    }
  }, [onCoursesLoaded]);

  // Login user
  const login = useCallback((matric: string) => {
    const trimmed = matric.trim();
    if (!trimmed || !/^\d{9}$/.test(trimmed)) {
      alert('Matric number must be exactly 9 digits');
      return;
    }
    
    localStorage.setItem('matricNumber', trimmed);
    setMatricNumber(trimmed);
    setIsNewUser(false);
  }, []);

  // Switch user
  const switchUser = useCallback(() => {
    setMatricNumber('');
    setSavedResults([]);
    localStorage.removeItem('matricNumber');
    setIsNewUser(true);
  }, []);

  // Save result
  const saveResult = useCallback((
    courses: Course[],
    gpa: number,
    graduationStatus: Omit<GraduationStatus, 'icon'>
  ) => {
    const trimmedMatric = matricNumber.trim();
    if (!trimmedMatric) {
      alert('Please enter your matriculation number');
      return;
    }

    if (courses.length === 0) {
      alert('Please add courses before saving');
      return;
    }

    const result: SavedResult = {
      id: Date.now().toString(),
      matricNumber: trimmedMatric,
      courses: [...courses],
      gpa,
      date: new Date().toISOString(),
      graduationStatus
    };

    const userResults = savedResults.filter(r => r.matricNumber === trimmedMatric);
    const updatedResults = [...userResults, result];

    setSavedResults(updatedResults);
    localStorage.setItem(`savedResults_${trimmedMatric}`, JSON.stringify(updatedResults));

    // Also update global storage for backward compatibility
    const allResults = JSON.parse(localStorage.getItem('savedResults') || '[]');
    const otherResults = allResults.filter((r: SavedResult) => r.matricNumber !== trimmedMatric);
    localStorage.setItem('savedResults', JSON.stringify([...otherResults, ...updatedResults]));

    setShowSaveDialog(false);
    alert('Your results have been saved successfully!');
  }, [matricNumber, savedResults]);

  // Load courses for current user
  const loadCoursesForUser = useCallback((): Course[] => {
    if (savedResults.length > 0) {
      const mostRecent = savedResults[savedResults.length - 1];
      return mostRecent.courses;
    }
    return [];
  }, [savedResults]);

  return {
    matricNumber,
    isNewUser,
    savedResults,
    showSaveDialog,
    login,
    switchUser,
    saveResult,
    setShowSaveDialog,
    loadCoursesForUser
  };
}
