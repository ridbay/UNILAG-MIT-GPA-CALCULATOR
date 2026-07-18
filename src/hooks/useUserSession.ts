import { useState, useEffect, useCallback } from "react";
import { Course, SavedResult, GraduationStatus } from "../types";

interface UseUserSessionReturn {
  // State
  name: string;
  matricNumber: string;
  isNewUser: boolean;
  savedResults: SavedResult[];
  showSaveDialog: boolean;
  isSyncing: boolean;

  // Actions
  login: (name: string, matric: string) => Promise<void>;
  switchUser: () => void;
  saveResult: (
    courses: Course[],
    gpa: number,
    graduationStatus: Omit<GraduationStatus, "icon">,
  ) => Promise<void>;
  setShowSaveDialog: (show: boolean) => void;
  loadCoursesForUser: () => Course[];
}

export function useUserSession(
  onCoursesLoaded?: (courses: Course[]) => void,
): UseUserSessionReturn {
  const [name, setName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch from API
  const fetchData = async (matric: string): Promise<SavedResult[] | null> => {
    try {
      const res = await fetch(`/api/results/${matric}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data.results)) {
          return json.data.results;
        } else if (json.data) {
          return [json.data]; // fallback
        }
      }
    } catch (e) {
      console.error("Failed to fetch from API", e);
    }
    return null;
  };

  // Check for existing user on mount
  useEffect(() => {
    const savedMatric = localStorage.getItem("matricNumber");
    const savedName = localStorage.getItem("userName");

    // Support legacy logins that might not have a name
    if (savedMatric) {
      setMatricNumber(savedMatric);
      if (savedName) setName(savedName);
      setIsNewUser(false);

      // Load saved results from local
      const userResults = localStorage.getItem(`savedResults_${savedMatric}`);
      if (userResults) {
        const parsedResults = JSON.parse(userResults);
        setSavedResults(parsedResults);

        // Load most recent courses
        if (parsedResults.length > 0 && onCoursesLoaded) {
          const mostRecent = parsedResults[parsedResults.length - 1];
          onCoursesLoaded(mostRecent.courses);
        }
      }

      // Attempt to sync in background
      fetchData(savedMatric).then((serverData) => {
        if (serverData && serverData.length > 0) {
          setSavedResults(serverData);
          localStorage.setItem(
            `savedResults_${savedMatric}`,
            JSON.stringify(serverData),
          );
          if (onCoursesLoaded) {
            onCoursesLoaded(serverData[serverData.length - 1].courses);
          }
        } else if (userResults) {
          // Server has no data but local does: Migrate it to Cloudflare!
          const parsedResults = JSON.parse(userResults);
          fetch(`/api/results/${savedMatric}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: savedName || "Student",
              data: { results: parsedResults },
            }),
          }).catch((e) => console.error("Failed to migrate local data", e));
        }
      });
    }
  }, [onCoursesLoaded]);

  // Login user
  const login = useCallback(
    async (loginName: string, matric: string) => {
      const trimmedMatric = matric.trim();
      const trimmedName = loginName.trim();

      if (!trimmedMatric || !/^\d{9}$/.test(trimmedMatric)) {
        alert("Matric number must be exactly 9 digits");
        return;
      }
      if (!trimmedName) {
        alert("Please enter your name");
        return;
      }

      setIsSyncing(true);
      try {
        localStorage.setItem("matricNumber", trimmedMatric);
        localStorage.setItem("userName", trimmedName);
        setMatricNumber(trimmedMatric);
        setName(trimmedName);
        setIsNewUser(false);

        const serverData = await fetchData(trimmedMatric);

        if (serverData && serverData.length > 0) {
          setSavedResults(serverData);
          localStorage.setItem(
            `savedResults_${trimmedMatric}`,
            JSON.stringify(serverData),
          );
          if (onCoursesLoaded) {
            onCoursesLoaded(serverData[serverData.length - 1].courses);
          }
        } else {
          // If local data exists, migrate it
          const localDataStr = localStorage.getItem(
            `savedResults_${trimmedMatric}`,
          );
          if (localDataStr) {
            const localData = JSON.parse(localDataStr);
            setSavedResults(localData);
            if (onCoursesLoaded && localData.length > 0) {
              onCoursesLoaded(localData[localData.length - 1].courses);
            }
            // Push local data to API
            await fetch(`/api/results/${trimmedMatric}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: trimmedName,
                data: { results: localData },
              }),
            });
          }
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [onCoursesLoaded],
  );

  // Switch user
  const switchUser = useCallback(() => {
    setMatricNumber("");
    setName("");
    setSavedResults([]);
    localStorage.removeItem("matricNumber");
    localStorage.removeItem("userName");
    setIsNewUser(true);
  }, []);

  // Save result
  const saveResult = useCallback(
    async (
      courses: Course[],
      gpa: number,
      graduationStatus: Omit<GraduationStatus, "icon">,
    ) => {
      const trimmedMatric = matricNumber.trim();
      // Default name if somehow not set
      const currentName = name || localStorage.getItem("userName") || "Student";

      if (!trimmedMatric) {
        alert("Please log in with matriculation number");
        return;
      }

      if (courses.length === 0) {
        alert("Please add courses before saving");
        return;
      }

      setIsSyncing(true);
      try {
        const result: SavedResult = {
          id: Date.now().toString(),
          matricNumber: trimmedMatric,
          name: currentName,
          courses: [...courses],
          gpa,
          date: new Date().toISOString(),
          graduationStatus,
        };

        const userResults = savedResults.filter(
          (r) => r.matricNumber === trimmedMatric,
        );
        const updatedResults = [...userResults, result];

        setSavedResults(updatedResults);
        localStorage.setItem(
          `savedResults_${trimmedMatric}`,
          JSON.stringify(updatedResults),
        );

        // Save to API
        await fetch(`/api/results/${trimmedMatric}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentName,
            data: { results: updatedResults },
          }),
        });

        setShowSaveDialog(false);
        alert("Your results have been saved successfully!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        alert("Failed to save to cloud. Saved locally.");
      } finally {
        setIsSyncing(false);
      }
    },
    [matricNumber, name, savedResults],
  );

  // Load courses for current user
  const loadCoursesForUser = useCallback((): Course[] => {
    if (savedResults.length > 0) {
      const mostRecent = savedResults[savedResults.length - 1];
      return mostRecent.courses;
    }
    return [];
  }, [savedResults]);

  return {
    name,
    matricNumber,
    isNewUser,
    savedResults,
    showSaveDialog,
    isSyncing,
    login,
    switchUser,
    saveResult,
    setShowSaveDialog,
    loadCoursesForUser,
  };
}
