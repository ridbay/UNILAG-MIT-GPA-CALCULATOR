import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, TrendingUp, Save, User, GraduationCap, Award, Sparkles, ChevronRight, Target, Zap } from 'lucide-react';

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
  const [matricNumber, setMatricNumber] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const switchUser = () => {
    setMatricNumber('');
    setCourses([]);
    setSavedResults([]);
    localStorage.removeItem('matricNumber');
    setIsNewUser(true);
  };

  const [isNewUser, setIsNewUser] = useState(() => {
    const savedMatric = localStorage.getItem('matricNumber');
    if (savedMatric) {
      const userResults = localStorage.getItem(`savedResults_${savedMatric}`);
      if (userResults) {
        const results = JSON.parse(userResults);
        if (results.length > 0) {
          const mostRecent = results[results.length - 1];
          setCourses(mostRecent.courses);
        }
      }
    }
    return !savedMatric;
  });

  useEffect(() => {
    const loadSavedData = () => {
      const savedMatric = localStorage.getItem('matricNumber');
      if (!savedMatric) return;

      setMatricNumber(savedMatric);

      const loadCoursesFromResults = (results: SavedResult[]) => {
        if (results.length > 0) {
          const mostRecent = results[results.length - 1];
          setCourses(mostRecent.courses);
          return true;
        }
        return false;
      };

      const userResults = localStorage.getItem(`savedResults_${savedMatric}`);
      if (userResults) {
        const parsedResults = JSON.parse(userResults);
        setSavedResults(parsedResults);
        if (loadCoursesFromResults(parsedResults)) {
          return;
        }
      }

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

    const userResults = savedResults.filter(r => r.matricNumber === trimmedMatric);
    const updatedResults = [...userResults, result];

    setSavedResults(updatedResults);
    localStorage.setItem(`savedResults_${trimmedMatric}`, JSON.stringify(updatedResults));

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
    { id: 'mit824', name: 'Seminar on Current Topics in IT', code: 'MIT 824', creditUnit: 3 },
    { id: 'mit899', name: 'Project', code: 'MIT 899', creditUnit: 6 },
    // Elective Courses
    { id: 'mit807', name: 'AI and its Business Application', code: 'MIT 807', creditUnit: 3 },
    { id: 'mit809', name: 'Elements of Scientific Computing', code: 'MIT 809', creditUnit: 3 },
    { id: 'mit813', name: 'Advanced Database Management Systems', code: 'MIT 813', creditUnit: 3 },
    { id: 'mit814', name: 'Human Computer Interactions', code: 'MIT 814', creditUnit: 3 },
    { id: 'mit816', name: 'Data Warehousing & Business Intelligence', code: 'MIT 816', creditUnit: 3 },
    { id: 'mit817', name: 'Software Engineering', code: 'MIT 817', creditUnit: 3 },
    { id: 'mit822', name: 'Operating Systems', code: 'MIT 822', creditUnit: 3 },
    { id: 'mit823', name: 'Office Automation & Project Management', code: 'MIT 823', creditUnit: 3 },
  ];

  const gradeSystem = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0
  };

  const gradeColors = {
    'A': 'from-emerald-400 to-emerald-600',
    'B': 'from-blue-400 to-blue-600',
    'C': 'from-cyan-400 to-cyan-600',
    'D': 'from-amber-400 to-amber-600',
    'E': 'from-orange-400 to-orange-600',
    'F': 'from-red-400 to-red-600'
  };

  const getSelectedCourse = (courseId: string) => {
    return availableCourses.find(course => course.id === courseId);
  };

  const getCourseDetails = (courseId: string) => {
    return availableCourses.find(course => course.id === courseId);
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    const totalGradePoints = courses.reduce((sum, course) =>
      sum + (course.gradePoint * course.creditUnit), 0);
    const totalUnitsTaken = courses.reduce((sum, course) =>
      sum + course.creditUnit, 0);
    return totalGradePoints / totalUnitsTaken;
  };

  const addCourse = () => {
    if (!currentCourse.courseId) return;

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
    if (courses.length === 0) return { status: 'Not Started', color: 'text-gray-400', description: 'Add courses to begin tracking', icon: Target };

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
  };

  const graduationStatus = getGraduationStatus();
  const StatusIcon = graduationStatus.icon;

  // New User Entry Screen
  if (isNewUser) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
        {/* Animated Background Orbs */}
        <div className="orb w-96 h-96 bg-emerald-500 top-0 -left-48 animate-float" />
        <div className="orb w-80 h-80 bg-yellow-500 bottom-20 -right-40 animate-float-delayed" />
        <div className="orb w-64 h-64 bg-blue-500 top-1/2 left-1/4 animate-float" style={{ animationDelay: '-2s' }} />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-subtle shadow-lg shadow-emerald-500/30">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome!</h1>
              <p className="text-emerald-700">UNILAG MIT GPA Calculator</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="matric-number" className="block text-sm font-medium text-slate-800 mb-2">
                  Matriculation Number
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="matric-number"
                    className={`w-full px-5 py-4 bg-white/10 border-2 ${matricNumber && !/^\d{9}$/.test(matricNumber) ? 'border-red-400/50' : 'border-white/20'
                      } rounded-xl text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white/80 transition-all duration-300 outline-none text-lg`}
                    placeholder="Enter 9-digit matric number"
                    value={matricNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                      setMatricNumber(value);
                    }}
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                </div>
                {matricNumber && !/^\d{9}$/.test(matricNumber) && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    Must be exactly 9 digits
                  </p>
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
                className="btn-premium w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-600 text-sm">
                Master of Information Technology
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Calculator Screen
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Animated Background */}
      <div className="orb w-[500px] h-[500px] bg-emerald-500/40 -top-64 -left-64 animate-float" />
      <div className="orb w-[400px] h-[400px] bg-yellow-500/30 bottom-0 -right-48 animate-float-delayed" />
      <div className="orb w-72 h-72 bg-blue-500/30 top-1/3 right-1/4 animate-float" style={{ animationDelay: '-4s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UNILAG MIT</h1>
                <p className="text-sm text-emerald-200">GPA Calculator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-medium">{matricNumber}</span>
              </div>
              <button
                onClick={switchUser}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title="Switch User"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* GPA Display Card */}
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="text-center">
                {/* Giant GPA Number */}
                <div className="relative inline-block mb-4">
                  <div className={`text-7xl font-black bg-gradient-to-br ${gpa >= 4.50 ? 'from-emerald-300 via-emerald-400 to-emerald-500' : gpa >= 2.40 ? 'from-blue-300 via-blue-400 to-blue-500' : gpa >= 1.50 ? 'from-orange-300 via-orange-400 to-orange-500' : 'from-red-300 via-red-400 to-red-500'} bg-clip-text text-transparent`}>
                    {gpa.toFixed(2)}
                  </div>
                  {gpa >= 4.50 && (
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                  )}
                </div>
                
                <div className="text-slate-700 text-sm mb-4">Cumulative GPA</div>
                
                {gpa > 0 && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gpa >= 4.50 ? 'from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30' : gpa >= 2.40 ? 'from-blue-500/20 to-blue-600/20 border border-blue-500/30' : 'from-orange-500/20 to-orange-600/20 border border-orange-500/30'}`}>
                    <span className={`font-semibold ${gpa >= 4.50 ? 'text-emerald-400' : gpa >= 2.40 ? 'text-blue-400' : 'text-orange-400'}`}>
                      {getGPAClass(gpa)}
                    </span>
                  </div>
                )}
              </div>

              {/* Graduation Status */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${gpa >= 4.50 ? 'from-emerald-500/20 to-emerald-600/20' : gpa >= 2.40 ? 'from-blue-500/20 to-blue-600/20' : 'from-gray-500/20 to-gray-600/20'}`}>
                    <StatusIcon className={`w-5 h-5 ${graduationStatus.color}`} />
                  </div>
                  <div>
                    <div className={`font-semibold ${graduationStatus.color}`}>{graduationStatus.status}</div>
                    <div className="text-xs text-slate-600">{graduationStatus.description}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 card-hover">
                <div className="text-3xl font-bold text-slate-900 mb-1">{courses.length}</div>
                <div className="text-xs text-slate-600">Courses</div>
              </div>
              <div className="glass rounded-xl p-4 card-hover">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{totalUnitsTaken}</div>
                <div className="text-xs text-slate-600">Total Units</div>
              </div>
              <div className="glass rounded-xl p-4 card-hover">
                <div className="text-3xl font-bold text-blue-600 mb-1">{totalUnitsPassed}</div>
                <div className="text-xs text-slate-600">Units Passed</div>
              </div>
              <div className="glass rounded-xl p-4 card-hover">
                <div className="text-3xl font-bold text-amber-600 mb-1">{totalGradePoints.toFixed(0)}</div>
                <div className="text-xs text-slate-600">Grade Points</div>
              </div>
            </div>

            {/* Requirements Progress */}
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Requirements
              </h3>
              
              <div className="space-y-4">
                {/* Compulsory Courses Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-800">Compulsory Courses</span>
                    <span className={`font-medium ${passedCompulsoryCourses.length === 13 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {passedCompulsoryCourses.length}/13
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(passedCompulsoryCourses.length / 13) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Minimum Units Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-800">Minimum Units (54)</span>
                    <span className={`font-medium ${meetsMinimumUnits ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {totalUnitsPassed}/54
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalUnitsPassed / 54) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {outstandingUnits > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 pt-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    {outstandingUnits} outstanding units
                  </div>
                )}
              </div>
            </div>

            {/* Add Course Form */}
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Add Course
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Select Course</label>
                  <select
                    value={currentCourse.courseId}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, courseId: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white transition-all duration-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-slate-900">Choose course...</option>
                    {availableCourses
                      .filter(course => !courses.some(c => c.courseId === course.id))
                      .map(course => (
                        <option key={course.id} value={course.id} className="bg-white text-slate-900">
                          {course.code} ({course.creditUnit}u)
                        </option>
                      ))}
                  </select>
                </div>

                {currentCourse.courseId && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-slide-up">
                    <div className="text-emerald-700 font-medium text-sm">
                      {getSelectedCourse(currentCourse.courseId)?.name}
                    </div>
                    <div className="text-emerald-600 text-xs mt-1">
                      {getSelectedCourse(currentCourse.courseId)?.creditUnit} Credit Units
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Grade</label>
                  <div className="grid grid-cols-6 gap-1 sm:gap-2">
                    {Object.entries(gradeSystem).map(([grade]) => (
                      <button
                        key={grade}
                        onClick={() => setCurrentCourse({ ...currentCourse, grade })}
                        className={`py-1.5 sm:py-0 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${
                          currentCourse.grade === grade
                            ? `bg-gradient-to-br ${gradeColors[grade as keyof typeof gradeColors]} text-white shadow-lg scale-105 sm:scale-110`
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addCourse}
                  disabled={!currentCourse.courseId}
                  className="btn-premium w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:shadow-none"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Course List */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Registered Courses
                  <span className="text-sm font-normal text-slate-600 ml-2">({courses.length})</span>
                </h2>
                
                <button
                  onClick={promptSave}
                  disabled={courses.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 disabled:bg-slate-100 disabled:text-slate-400 text-emerald-700 rounded-lg transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                    <BookOpen className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-slate-700 font-medium mb-2">No courses yet</h3>
                  <p className="text-slate-600 text-sm">Add your first course to start calculating</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {courses.map((course, index) => {
                    const courseDetails = getCourseDetails(course.courseId);
                    return (
                      <div
                        key={course.id}
                        className="stagger-item group bg-slate-50 hover:bg-slate-100 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-4">
                          {/* Grade Badge */}
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradeColors[course.grade as keyof typeof gradeColors]} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-xl">{course.grade}</span>
                          </div>
                          
                          {/* Course Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-slate-900 font-medium truncate">{courseDetails?.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-slate-600 text-sm">{courseDetails?.code}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full" />
                              <span className="text-emerald-600 text-sm">{course.creditUnit} units</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="hidden sm:flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-slate-900 font-semibold">{course.gradePoint}.0</div>
                              <div className="text-slate-600 text-xs">Points</div>
                            </div>
                            <div className="text-center">
                              <div className="text-emerald-600 font-semibold">{(course.gradePoint * course.creditUnit).toFixed(0)}</div>
                              <div className="text-slate-600 text-xs">Total</div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeCourse(course.id)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Grade Scale Legend */}
              {courses.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                    {Object.entries(gradeSystem).map(([grade, point]) => (
                      <div key={grade} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradeColors[grade as keyof typeof gradeColors]} flex items-center justify-center`}>
                          <span className="text-white font-bold text-xs">{grade}</span>
                        </div>
                        <span className="text-slate-700">{point}.0</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <a 
                href="https://balogunridwan.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                Built by Ridwan Balogun
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Save Results</h3>
            <p className="text-slate-600 text-sm mb-6">
              Save your current progress to retrieve it later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResult}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl transition-all duration-200 font-medium"
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