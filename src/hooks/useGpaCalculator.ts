import { useState, useCallback, useMemo } from 'react';
import { Award, GraduationCap, Target, Zap } from 'lucide-react';
import { Course, Grade, GraduationStatus } from '../types';
import { AVAILABLE_COURSES, COMPULSORY_COURSE_IDS, GRADE_SYSTEM, getCourseById } from '../data/courses';

interface UseGpaCalculatorReturn {
  // State
  courses: Course[];
  currentCourse: { courseId: string; grade: Grade };
  
  // Actions
  addCourse: () => boolean;
  removeCourse: (id: string) => void;
  updateCourseGrade: (id: string, grade: Grade) => void;
  setCurrentCourse: (course: { courseId: string; grade: Grade }) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  
  // Computed values
  gpa: number;
  totalUnitsTaken: number;
  totalUnitsPassed: number;
  totalGradePoints: number;
  gpaClass: string;
  graduationStatus: GraduationStatus;
  passedCompulsoryCourses: Course[];
  meetsMinimumUnits: boolean;
  outstandingUnits: number;
  availableCoursesFiltered: typeof AVAILABLE_COURSES;
}

export function useGpaCalculator(): UseGpaCalculatorReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<{ courseId: string; grade: Grade }>({
    courseId: '',
    grade: 'A'
  });

  // Add a course
  const addCourse = useCallback(() => {
    if (!currentCourse.courseId) return false;

    if (courses.some(course => course.courseId === currentCourse.courseId)) {
      alert('This course has already been added!');
      return false;
    }

    const selectedCourse = getCourseById(currentCourse.courseId);
    if (!selectedCourse) return false;

    const newCourse: Course = {
      id: Date.now().toString(),
      courseId: currentCourse.courseId,
      creditUnit: selectedCourse.creditUnit,
      grade: currentCourse.grade,
      gradePoint: GRADE_SYSTEM[currentCourse.grade]
    };

    setCourses(prev => [...prev, newCourse]);
    setCurrentCourse({ courseId: '', grade: 'A' });
    return true;
  }, [courses, currentCourse]);

  // Remove a course
  const removeCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  }, []);

  // Update course grade
  const updateCourseGrade = useCallback((id: string, grade: Grade) => {
    setCourses(prev => prev.map(course => 
      course.id === id 
        ? { ...course, grade, gradePoint: GRADE_SYSTEM[grade] }
        : course
    ));
  }, []);

  // Calculate GPA
  const gpa = useMemo(() => {
    if (courses.length === 0) return 0;
    const totalGradePoints = courses.reduce((sum, course) =>
      sum + (course.gradePoint * course.creditUnit), 0);
    const totalUnits = courses.reduce((sum, course) =>
      sum + course.creditUnit, 0);
    return totalGradePoints / totalUnits;
  }, [courses]);

  // Total units taken
  const totalUnitsTaken = useMemo(() => 
    courses.reduce((sum, course) => sum + course.creditUnit, 0),
    [courses]
  );

  // Total units passed
  const totalUnitsPassed = useMemo(() =>
    courses.reduce((sum, course) =>
      course.gradePoint > 0 ? sum + course.creditUnit : sum, 0),
    [courses]
  );

  // Total grade points
  const totalGradePoints = useMemo(() =>
    courses.reduce((sum, course) =>
      sum + (course.gradePoint * course.creditUnit), 0),
    [courses]
  );

  // GPA Class
  const gpaClass = useMemo(() => {
    if (gpa >= 4.50) return 'Distinction';
    if (gpa >= 2.40) return 'Pass';
    if (gpa >= 1.50) return 'Fail/Repeat';
    return 'Fail/Withdraw';
  }, [gpa]);

  // Compulsory courses analysis
  const compulsoryCourses = useMemo(() =>
    courses.filter(course => COMPULSORY_COURSE_IDS.includes(course.courseId)),
    [courses]
  );

  const passedCompulsoryCourses = useMemo(() =>
    compulsoryCourses.filter(course => course.gradePoint > 0),
    [compulsoryCourses]
  );

  const failedCompulsoryCourses = useMemo(() =>
    compulsoryCourses.filter(course => course.gradePoint === 0),
    [compulsoryCourses]
  );

  const outstandingUnits = useMemo(() =>
    courses.filter(course => course.gradePoint === 0)
      .reduce((sum, course) => sum + course.creditUnit, 0),
    [courses]
  );

  const meetsMinimumUnits = totalUnitsPassed >= 54;
  const passedAllCompulsory = failedCompulsoryCourses.length === 0 && passedCompulsoryCourses.length === 13;

  // Graduation status
  const graduationStatus: GraduationStatus = useMemo(() => {
    if (courses.length === 0) {
      return { status: 'Not Started', color: 'text-gray-400', description: 'Add courses to begin tracking', icon: Target };
    }

    if (gpa >= 4.50 && passedAllCompulsory && meetsMinimumUnits) {
      return { status: 'Distinction! 🎉', color: 'text-emerald-400', description: 'Outstanding achievement!', icon: Award };
    }

    if (gpa >= 2.40 && passedAllCompulsory && meetsMinimumUnits) {
      return { status: 'Pass ✓', color: 'text-blue-400', description: 'You meet graduation requirements.', icon: GraduationCap };
    }

    if (gpa >= 2.40 && outstandingUnits <= 9 && outstandingUnits > 0) {
      return { status: 'Referred', color: 'text-yellow-400', description: `${outstandingUnits} outstanding units remaining.`, icon: Zap };
    }

    if (gpa >= 2.40 && outstandingUnits > 9) {
      return { status: 'Fail/Repeat', color: 'text-red-400', description: `${outstandingUnits} outstanding units (>9).`, icon: Target };
    }

    if (gpa >= 1.50 && gpa < 2.40) {
      return { status: 'Fail/Repeat', color: 'text-red-400', description: 'GPA below minimum threshold.', icon: Target };
    }

    if (gpa < 1.50) {
      return { status: 'Fail/Withdraw', color: 'text-red-500', description: 'GPA critically low.', icon: Target };
    }

    return { status: 'In Progress', color: 'text-gray-400', description: 'Continue adding courses.', icon: Target };
  }, [courses.length, gpa, passedAllCompulsory, meetsMinimumUnits, outstandingUnits]);

  // Available courses (excluding already added)
  const availableCoursesFiltered = useMemo(() =>
    AVAILABLE_COURSES.filter(course => !courses.some(c => c.courseId === course.id)),
    [courses]
  );

  return {
    courses,
    currentCourse,
    addCourse,
    removeCourse,
    updateCourseGrade,
    setCurrentCourse,
    setCourses,
    gpa,
    totalUnitsTaken,
    totalUnitsPassed,
    totalGradePoints,
    gpaClass,
    graduationStatus,
    passedCompulsoryCourses,
    meetsMinimumUnits,
    outstandingUnits,
    availableCoursesFiltered
  };
}
