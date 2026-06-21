import { useState, useCallback, useRef, useEffect } from 'react';
import { useGpaCalculator } from './hooks/useGpaCalculator';
import { useUserSession } from './hooks/useUserSession';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { GpaDisplay } from './components/GpaDisplay';
import { StatsGrid } from './components/StatsGrid';
import { RequirementsCard } from './components/RequirementsCard';
import { AddCourseForm } from './components/AddCourseForm';
import { CourseList } from './components/CourseList';
import { SaveDialog } from './components/SaveDialog';
import { GpaSimulator } from './components/GpaSimulator';
import { Course } from './types';
import { exportToPDF } from './utils/exportPdf';
import { shareAsImage } from './utils/shareImage';

function App() {
  const [pendingMatric, setPendingMatric] = useState('');
  
  const gpaCalculator = useGpaCalculator();
  
  // Use ref to store setCourses to avoid circular dependency
  const setCoursesRef = useRef(gpaCalculator.setCourses);
  useEffect(() => {
    setCoursesRef.current = gpaCalculator.setCourses;
  }, [gpaCalculator.setCourses]);
  
  const handleCoursesLoaded = useCallback((loadedCourses: Course[]) => {
    setCoursesRef.current(loadedCourses);
  }, []);
  
  const userSession = useUserSession(handleCoursesLoaded);

  // Handle login
  const handleLogin = () => {
    userSession.login(pendingMatric);
    setPendingMatric('');
  };

  // Handle save
  const handleSave = () => {
    const { status, color, description } = gpaCalculator.graduationStatus;
    userSession.saveResult(gpaCalculator.courses, gpaCalculator.gpa, { status, color, description });
  };

  // Handle PDF export
  const handleExportPdf = () => {
    const { status, description } = gpaCalculator.graduationStatus;
    exportToPDF({
      matricNumber: userSession.matricNumber,
      courses: gpaCalculator.courses,
      gpa: gpaCalculator.gpa,
      gpaClass: gpaCalculator.gpaClass,
      totalUnitsTaken: gpaCalculator.totalUnitsTaken,
      totalUnitsPassed: gpaCalculator.totalUnitsPassed,
      totalGradePoints: gpaCalculator.totalGradePoints,
      graduationStatus: { status, description }
    });
  };

  // Handle switch user (also reset courses)
  const handleSwitchUser = () => {
    userSession.switchUser();
    gpaCalculator.setCourses([]);
  };

  // Handle share
  const handleShare = () => {
    shareAsImage({
      gpa: gpaCalculator.gpa,
      gpaClass: gpaCalculator.gpaClass,
      matricNumber: userSession.matricNumber,
      coursesCount: gpaCalculator.courses.length,
      totalUnits: gpaCalculator.totalUnitsTaken,
      totalGradePoints: gpaCalculator.totalGradePoints
    });
  };

  // Show welcome screen for new users
  if (userSession.isNewUser) {
    return (
      <WelcomeScreen
        matricNumber={pendingMatric}
        onMatricChange={setPendingMatric}
        onLogin={handleLogin}
      />
    );
  }

  // Main calculator view
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Animated Background */}
      <div className="orb w-[500px] h-[500px] bg-emerald-500/40 -top-64 -left-64 animate-float" />
      <div className="orb w-[400px] h-[400px] bg-yellow-500/30 bottom-0 -right-48 animate-float-delayed" />
      <div className="orb w-72 h-72 bg-blue-500/30 top-1/3 right-1/4 animate-float" style={{ animationDelay: '-4s' }} />

      <Header
        matricNumber={userSession.matricNumber}
        onSwitchUser={handleSwitchUser}
      />

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 py-12">
        <div className="bento-grid">
          {/* Left Column - Fixed Width Content */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="stagger-item">
              <GpaDisplay
                gpa={gpaCalculator.gpa}
                gpaClass={gpaCalculator.gpaClass}
                graduationStatus={gpaCalculator.graduationStatus}
              />
            </div>

            <div className="stagger-item">
              <StatsGrid
                coursesCount={gpaCalculator.courses.length}
                totalUnitsTaken={gpaCalculator.totalUnitsTaken}
                totalUnitsPassed={gpaCalculator.totalUnitsPassed}
                totalGradePoints={gpaCalculator.totalGradePoints}
              />
            </div>

            <div className="stagger-item">
              <div className="bento-item">
                <RequirementsCard
                  passedCompulsoryCourses={gpaCalculator.passedCompulsoryCourses}
                  totalUnitsPassed={gpaCalculator.totalUnitsPassed}
                  meetsMinimumUnits={gpaCalculator.meetsMinimumUnits}
                  outstandingUnits={gpaCalculator.outstandingUnits}
                />
              </div>
            </div>

            <div className="stagger-item">
              <div className="bento-item">
                <AddCourseForm
                  currentCourse={gpaCalculator.currentCourse}
                  availableCourses={gpaCalculator.availableCoursesFiltered}
                  onCourseChange={gpaCalculator.setCurrentCourse}
                  onAddCourse={gpaCalculator.addCourse}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Main Content Area */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="stagger-item h-full min-h-[500px]">
              <div className="bento-item h-full flex flex-col">
                <CourseList
                  courses={gpaCalculator.courses}
                  onRemoveCourse={gpaCalculator.removeCourse}
                  onUpdateGrade={gpaCalculator.updateCourseGrade}
                  onSave={() => userSession.setShowSaveDialog(true)}
                  onExportPdf={handleExportPdf}
                  onShare={handleShare}
                  canSave={gpaCalculator.courses.length > 0}
                />
              </div>
            </div>

            <div className="stagger-item">
              <div className="bento-item">
                <GpaSimulator
                  currentGpa={gpaCalculator.gpa}
                  totalUnits={gpaCalculator.totalUnitsTaken}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SaveDialog
        isOpen={userSession.showSaveDialog}
        onClose={() => userSession.setShowSaveDialog(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;