import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, BookOpen, TrendingUp, Save, User } from 'lucide-react';

interface SavedResult {
  id: string;
  matricNumber: string;
  courses: Course[];
  gpa: number;
  date: string;
  graduationStatus: {
    status: string;
    color: string;
    description: string;
  };
}

interface Course {
  id: string;
  courseId: string;
  creditUnit: number;
  grade: string;
  gradePoint: number;
}

interface CourseOption {
  id: string;
  name: string;
  code: string;
  creditUnit: number;
}

function App() {
  // const [showMatricModal, setShowMatricModal] = useState(false);
  const [matricNumber, setMatricNumber] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const switchUser = () => {
    // Clear current user data
    setMatricNumber('');
    setCourses([]);
    setSavedResults([]);
    localStorage.removeItem('matricNumber');
    setIsNewUser(true);
  };

  const [isNewUser, setIsNewUser] = useState(() => {
    // Check if user has a saved matric number
    const savedMatric = localStorage.getItem('matricNumber');
    if (savedMatric) {
      // If returning user, load their data
      const userResults = localStorage.getItem(`savedResults_${savedMatric}`);
      if (userResults) {
        const results = JSON.parse(userResults);
        if (results.length > 0) {
          // Get the most recent result
          const mostRecent = results[results.length - 1];
          setCourses(mostRecent.courses);
        }
      }
    }
    return !savedMatric;
  });

  // Load saved results from localStorage on initial render
  useEffect(() => {
    const loadSavedData = () => {
      const savedMatric = localStorage.getItem('matricNumber');
      if (!savedMatric) return;

      // Set the matric number in state
      setMatricNumber(savedMatric);

      // Helper function to load courses from results
      const loadCoursesFromResults = (results: SavedResult[]) => {
        if (results.length > 0) {
          const mostRecent = results[results.length - 1];
          setCourses(mostRecent.courses);
          return true;
        }
        return false;
      };

      // Try to load from matric-specific storage first
      const userResults = localStorage.getItem(`savedResults_${savedMatric}`);
      if (userResults) {
        const parsedResults = JSON.parse(userResults);
        setSavedResults(parsedResults);
        if (loadCoursesFromResults(parsedResults)) {
          return; // Exit if courses were loaded
        }
      }

      // Fall back to global storage for backward compatibility
      const allResults = localStorage.getItem('savedResults');
      if (allResults) {
        const userResultsFromGlobal = JSON.parse(allResults)
          .filter((r: SavedResult) => r.matricNumber === savedMatric);
        if (userResultsFromGlobal.length > 0) {
          setSavedResults(userResultsFromGlobal);
          loadCoursesFromResults(userResultsFromGlobal);
        }
      }
    };

    loadSavedData();
  }, [setCourses, setMatricNumber, setSavedResults]);

  const handleSaveResult = () => {
    const trimmedMatric = matricNumber.trim();
    if (!trimmedMatric) {
      alert('Please enter your matriculation number');
      return;
    }

    const result: SavedResult = {
      id: Date.now().toString(),
      matricNumber: trimmedMatric,
      courses: [...courses],
      gpa,
      date: new Date().toISOString(),
      graduationStatus: graduationStatus
    };

    // Get existing results for this matric number
    const userResults = savedResults.filter(r => r.matricNumber === trimmedMatric);

    // Add new result
    const updatedResults = [...userResults, result];

    // Update state and localStorage
    setSavedResults(updatedResults);
    localStorage.setItem(`savedResults_${trimmedMatric}`, JSON.stringify(updatedResults));

    // Also update the global savedResults for backward compatibility
    const allResults = JSON.parse(localStorage.getItem('savedResults') || '[]');
    const otherResults = allResults.filter((r: SavedResult) => r.matricNumber !== trimmedMatric);
    localStorage.setItem('savedResults', JSON.stringify([...otherResults, ...updatedResults]));

    setShowSaveDialog(false);
    alert('Your results have been saved successfully!');
  };

  const promptSave = () => {
    if (courses.length === 0) {
      alert('Please add courses before saving');
      return;
    }
    setShowSaveDialog(true);
  };
  const [currentCourse, setCurrentCourse] = useState({
    courseId: '',
    grade: 'A'
  });

  // Sample UNILAG MIT courses
  const availableCourses: CourseOption[] = [
    // Compulsory Courses
    { id: 'mit801', name: 'Introduction to Information Technology', code: 'MIT 801', creditUnit: 3 },
    { id: 'mit802', name: 'Introduction to Database Management', code: 'MIT 802', creditUnit: 3 },
    { id: 'mit803', name: 'Programming Languages', code: 'MIT 803', creditUnit: 3 },
    { id: 'mit804', name: 'Object-Oriented Programming', code: 'MIT 804', creditUnit: 3 },
    { id: 'mit805', name: 'Computer Systems and Organization', code: 'MIT 805', creditUnit: 3 },
    { id: 'mit806', name: 'IT and LAW', code: 'MIT 806', creditUnit: 3 },
    { id: 'mit808', name: 'Concepts and Application of E-Business', code: 'MIT 808', creditUnit: 2 },
    { id: 'mit811', name: 'Analysis and Design of Business Information Systems', code: 'MIT 811', creditUnit: 3 },
    { id: 'mit812', name: 'Computer Networks and Communication Protocol', code: 'MIT 812', creditUnit: 3 },
    { id: 'mit815', name: 'Internet Programming and Applications', code: 'MIT 815', creditUnit: 3 },
    { id: 'mit821', name: 'Software Systems', code: 'MIT 821', creditUnit: 3 },
    { id: 'mit824', name: 'Seminar on Current Topics in Information Technology', code: 'MIT 824', creditUnit: 3 },
    { id: 'mit899', name: 'Project', code: 'MIT 899', creditUnit: 6 },

    // Elective Courses
    { id: 'mit807', name: 'AI and its Business Application', code: 'MIT 807', creditUnit: 3 },
    { id: 'mit809', name: 'Elements of Scientific Computing', code: 'MIT 809', creditUnit: 3 },
    { id: 'mit813', name: 'Advanced Database Management Systems', code: 'MIT 813', creditUnit: 3 },
    { id: 'mit814', name: 'Human Computer Interactions', code: 'MIT 814', creditUnit: 3 },
    { id: 'mit816', name: 'Data Warehousing, Data Mining and Business Intelligence', code: 'MIT 816', creditUnit: 3 },
    { id: 'mit817', name: 'Software Engineering', code: 'MIT 817', creditUnit: 3 },
    { id: 'mit822', name: 'Operating Systems', code: 'MIT 822', creditUnit: 3 },
    { id: 'mit823', name: 'Office Automation and Project Management', code: 'MIT 823', creditUnit: 3 },
  ];

  const gradeSystem = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0
  };

  const getSelectedCourse = (courseId: string) => {
    return availableCourses.find(course => course.id === courseId);
  };

  const getCourseDetails = (courseId: string) => {
    return availableCourses.find(course => course.id === courseId);
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;

    // 1. Grade Point Per Course = Number of Units × Result Point (already calculated when adding course)
    // 2. Total Grade Points = Sum of all individual course grade points
    const totalGradePoints = courses.reduce((sum, course) =>
      sum + (course.gradePoint * course.creditUnit), 0);

    // Total Units Taken includes ALL courses registered (including failed ones)
    const totalUnitsTaken = courses.reduce((sum, course) =>
      sum + course.creditUnit, 0);

    // 3. GPA = Total Grade Points / Total Units Taken
    return totalGradePoints / totalUnitsTaken;
  };

  const addCourse = () => {
    if (!currentCourse.courseId) return;

    // Check if course is already added
    if (courses.some(course => course.courseId === currentCourse.courseId)) {
      alert('This course has already been added!');
      return;
    }

    const selectedCourse = getSelectedCourse(currentCourse.courseId);
    if (!selectedCourse) return;

    const newCourse: Course = {
      id: Date.now().toString(),
      courseId: currentCourse.courseId,
      creditUnit: selectedCourse.creditUnit,
      grade: currentCourse.grade,
      gradePoint: gradeSystem[currentCourse.grade as keyof typeof gradeSystem]
    };

    setCourses([...courses, newCourse]);
    setCurrentCourse({ courseId: '', grade: 'A' });
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const gpa = calculateGPA();
  const totalUnitsTaken = courses.reduce((sum, course) => sum + course.creditUnit, 0);
  const totalUnitsPassed = courses.reduce((sum, course) =>
    course.gradePoint > 0 ? sum + course.creditUnit : sum, 0);
  const totalGradePoints = courses.reduce((sum, course) =>
    sum + (course.gradePoint * course.creditUnit), 0);

  const getGPAClass = (gpa: number) => {
    if (gpa >= 4.50) return 'Distinction';
    if (gpa >= 2.40) return 'Pass';
    if (gpa >= 1.50) return 'Fail/Repeat';
    return 'Fail/Withdraw';
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 4.50) return 'text-emerald-600';
    if (gpa >= 2.40) return 'text-blue-600';
    if (gpa >= 1.50) return 'text-orange-600';
    return 'text-red-600';
  };

  // Calculate degree requirements status
  const compulsoryCourses = courses.filter(course => {
    const courseDetails = getCourseDetails(course.courseId);
    return courseDetails && ['mit801', 'mit802', 'mit803', 'mit804', 'mit805', 'mit806', 'mit808', 'mit811', 'mit812', 'mit815', 'mit821', 'mit824', 'mit899'].includes(courseDetails.id);
  });

  const passedCompulsoryCourses = compulsoryCourses.filter(course => course.gradePoint > 0);
  const failedCompulsoryCourses = compulsoryCourses.filter(course => course.gradePoint === 0);
  const outstandingUnits = courses.filter(course => course.gradePoint === 0).reduce((sum, course) => sum + course.creditUnit, 0);

  const meetsMinimumUnits = totalUnitsPassed >= 54;
  const passedAllCompulsory = failedCompulsoryCourses.length === 0 && passedCompulsoryCourses.length === 13;

  const getGraduationStatus = () => {
    if (courses.length === 0) return { status: 'Not Started', color: 'text-gray-500', description: 'Add courses to see graduation status' };

    if (gpa >= 4.50 && passedAllCompulsory && meetsMinimumUnits) {
      return { status: 'Graduate with Distinction', color: 'text-emerald-600', description: 'Congratulations! You meet all requirements for distinction.' };
    }

    if (gpa >= 2.40 && passedAllCompulsory && meetsMinimumUnits) {
      return { status: 'Graduate with Pass', color: 'text-blue-600', description: 'You meet all requirements for graduation.' };
    }

    if (gpa >= 2.40 && outstandingUnits <= 9 && outstandingUnits > 0) {
      return { status: 'Referred (Outstanding Courses)', color: 'text-yellow-600', description: `You have ${outstandingUnits} outstanding units. Complete them to graduate.` };
    }

    if (gpa >= 2.40 && outstandingUnits > 9) {
      return { status: 'Fail/Repeat', color: 'text-red-600', description: `You have ${outstandingUnits} outstanding units (>9). You need to repeat.` };
    }

    if (gpa >= 1.50 && gpa < 2.40) {
      return { status: 'Fail/Repeat', color: 'text-red-600', description: 'GPA below 2.40. You need to repeat to improve your grades.' };
    }

    if (gpa < 1.50) {
      return { status: 'Fail/Withdraw', color: 'text-red-600', description: 'GPA below 1.50. You may be asked to withdraw.' };
    }

    return { status: 'In Progress', color: 'text-gray-600', description: 'Continue adding courses to track your progress.' };
  };

  const graduationStatus = getGraduationStatus();
  // Show matric number entry screen for new users
  if (isNewUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Enter Your Matriculation Number</h2>
            <p className="mt-2 text-gray-600">To get started, please enter your UNILAG matriculation number</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="matric-number" className="block text-sm font-medium text-gray-700 mb-1">
                Matriculation Number
              </label>
              <input
                type="text"
                id="matric-number"
                className={`w-full px-4 py-2 border ${matricNumber && (!/^\d{9}$/.test(matricNumber) ? 'border-red-500' : 'border-gray-300')
                  } rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                placeholder="e.g. 190404000"
                value={matricNumber}
                onChange={(e) => {
                  // Only allow numbers and limit to 9 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setMatricNumber(value);
                }}
                autoFocus
              />
              {matricNumber && !/^\d{9}$/.test(matricNumber) && (
                <p className="mt-1 text-sm text-red-600">Matric number must be exactly 9 digits</p>
              )}
            </div>
            <button
              onClick={() => {
                const trimmedMatric = matricNumber.trim();
                if (!trimmedMatric) {
                  alert('Please enter your matriculation number');
                  return;
                }
                if (!/^\d{9}$/.test(trimmedMatric)) {
                  alert('Matric number must be exactly 9 digits');
                  return;
                }
                localStorage.setItem('matricNumber', trimmedMatric);
                setIsNewUser(false);
              }}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Continue to GPA Calculator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UNILAG MIT</h1>
                <p className="text-sm text-gray-600">GPA Calculator</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Course Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-emerald-600" />
                Add Course
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select
                    value={currentCourse.courseId}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, courseId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Choose a course...</option>
                    {availableCourses
                      .filter(course => !courses.some(c => c.courseId === course.id))
                      .map(course => (
                        <option key={course.id} value={course.id}>
                          {course.code} - {course.name} ({course.creditUnit} units)
                        </option>
                      ))}
                  </select>
                </div>

                {currentCourse.courseId && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-sm text-emerald-800">
                      <strong>{getSelectedCourse(currentCourse.courseId)?.code}</strong> - {getSelectedCourse(currentCourse.courseId)?.name}
                      <br />
                      <span className="text-emerald-600">Credit Units: {getSelectedCourse(currentCourse.courseId)?.creditUnit}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Grade
                  </label>
                  <select
                    value={currentCourse.grade}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, grade: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  >
                    {Object.entries(gradeSystem).map(([grade, point]) => (
                      <option key={grade} value={grade}>
                        {grade} - {point}.0 Point{point !== 1 ? 's' : ''}
                        {grade === 'A' && ' (Excellent)'}
                        {grade === 'B' && ' (Very Good)'}
                        {grade === 'C' && ' (Good)'}
                        {grade === 'D' && ' (Fair)'}
                        {grade === 'E' && ' (Pass)'}
                        {grade === 'F' && ' (Fail)'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addCourse}
                  disabled={!currentCourse.courseId}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </button>
              </div>
            </div>

            {/* Available Courses Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                Programme Requirements
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Compulsory Courses:</strong> {passedCompulsoryCourses.length}/13 passed</p>
                <p><strong>Minimum Units Required:</strong> 54 units</p>
                <p><strong>Units Passed:</strong> {totalUnitsPassed}/54</p>
                {outstandingUnits > 0 && (
                  <p><strong>Outstanding Units:</strong> <span className="text-red-600">{outstandingUnits}</span></p>
                )}
                <div className="mt-3 text-xs">
                  <p className="font-medium text-gray-700 mb-1">Programme Structure:</p>
                  <div className="space-y-1">
                    <span>• Compulsory Courses: 13</span>
                    <span>• Elective Courses: 8</span>
                    <span>• Total Credit Units: 62</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GPA Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                Academic Standing
              </h3>

              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getGPAColor(gpa)} mb-2`}>
                    {gpa.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Current GPA</div>
                  {gpa > 0 && (
                    <div className={`text-sm font-medium mt-1 ${getGPAColor(gpa)}`}>
                      {getGPAClass(gpa)}
                    </div>
                  )}
                </div>

                {/* Graduation Status */}
                <div className="border-t pt-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${graduationStatus.color} mb-1`}>
                      {graduationStatus.status}
                    </div>
                    <div className="text-xs text-gray-600 px-2">
                      {graduationStatus.description}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Courses:</span>
                    <span className="font-medium">{courses.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Total Units Taken:</span>
                    <span className="font-medium">{totalUnitsTaken}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Total Units Passed:</span>
                    <span className="font-medium text-emerald-600">{totalUnitsPassed}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Total Grade Points:</span>
                    <span className="font-medium">{totalGradePoints.toFixed(1)}</span>
                  </div>
                  {totalUnitsTaken > totalUnitsPassed && (
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-600">Units Failed:</span>
                      <span className="font-medium text-red-600">{totalUnitsTaken - totalUnitsPassed}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Compulsory Passed:</span>
                    <span className={`font-medium ${passedAllCompulsory ? 'text-emerald-600' : 'text-red-600'}`}>
                      {passedCompulsoryCourses.length}/13
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Min Units Met:</span>
                    <span className={`font-medium ${meetsMinimumUnits ? 'text-emerald-600' : 'text-red-600'}`}>
                      {meetsMinimumUnits ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                Registered Courses ({courses.length})
              </h2>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No courses added yet</p>
                  <p className="text-sm text-gray-400">Select a course from the dropdown to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => {
                    const courseDetails = getCourseDetails(course.courseId);
                    return (
                      <div
                        key={course.id}
                        className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{courseDetails?.name}</h3>
                                <p className="text-sm text-gray-600">{courseDetails?.code}</p>
                              </div>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="text-center">
                                  <div className="font-medium text-gray-800">{course.creditUnit}</div>
                                  <div className="text-xs text-gray-500">Units</div>
                                </div>
                                <div className="text-center">
                                  <div className={`font-bold text-lg ${getGPAColor(course.gradePoint)}`}>
                                    {course.grade}
                                  </div>
                                  <div className="text-xs text-gray-500">{course.gradePoint}.0</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium text-gray-800">
                                    {(course.gradePoint * course.creditUnit).toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-500">Points</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCourse(course.id)}
                            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Grade Scale Reference */}
              {courses.length > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">UNILAG Grading Scale</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                    {Object.entries(gradeSystem).map(([grade, point]) => (
                      <div key={grade} className="text-center">
                        <div className={`font-bold ${getGPAColor(point)}`}>{grade}</div>
                        <div className="text-gray-500">{point}.0</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    <p><strong>MIT Programme:</strong> Master of Information Technology - UNILAG</p>
                    <p><strong>Graduation Requirements:</strong></p>
                    <div className="mt-2 space-y-1 text-xs">
                      <p>• Pass all 13 compulsory courses</p>
                      <p>• Minimum 54 units passed</p>
                      <p>• CGPA ≥ 4.50: Graduate with Distinction</p>
                      <p>• CGPA ≥ 2.40: Graduate with Pass</p>
                      <p>• CGPA 1.50-2.39: Fail/Repeat</p>
                      <p>• CGPA &lt; 1.50: Fail/Withdraw</p>
                      <p>• Max 9 outstanding units for referral</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
              {/* Mobile Action Buttons - Only shown on mobile */}
              <div className="sm:hidden flex flex-col space-y-2 w-full">
                <button
                  onClick={promptSave}
                  className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Results</span>
                </button>
                <button
                  onClick={switchUser}
                  className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Switch User</span>
                </button>
              </div>

              {/* Desktop Links */}
              <div className="hidden sm:flex items-center space-x-4 text-gray-600">
                <button
                  onClick={promptSave}
                  className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
                  title="Save current progress"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Progress</span>
                </button>
                <button
                  onClick={switchUser}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  title="Switch user"
                >
                  <User className="w-4 h-4" />
                  <span>Switch User</span>
                </button>
                <a href="https://balogunridwan.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Built by Ridwan Balogun</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Save Confirmation Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Your Results</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save your current course selection and results?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResult}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;