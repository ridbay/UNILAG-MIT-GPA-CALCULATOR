import { BookOpen, Trash2, Save, TrendingUp, FileDown } from 'lucide-react';
import { Course, Grade } from '../types';
import { GRADE_COLORS, GRADES, GRADE_SYSTEM, getCourseById } from '../data/courses';

interface CourseListProps {
  courses: Course[];
  onRemoveCourse: (id: string) => void;
  onSave: () => void;
  onExportPdf: () => void;
  canSave: boolean;
}

export function CourseList({ courses, onRemoveCourse, onSave, onExportPdf, canSave }: CourseListProps) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-6 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Registered Courses
          <span className="text-sm font-normal text-slate-600 ml-2">({courses.length})</span>
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onExportPdf}
            disabled={!canSave}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 disabled:bg-slate-100 disabled:text-slate-400 text-blue-700 rounded-lg transition-colors"
            title="Export as PDF"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={onSave}
            disabled={!canSave}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 disabled:bg-slate-100 disabled:text-slate-400 text-emerald-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
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
        <div className="space-y-3 max-h-[600px] overflow-y-auto overflow-x-hidden">
          {courses.map((course) => {
            const courseDetails = getCourseById(course.courseId);
            return (
              <div
                key={course.id}
                className="bg-slate-50 hover:bg-slate-100 rounded-xl p-3 sm:p-4 border border-slate-200"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Grade Badge */}
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${GRADE_COLORS[course.grade as Grade]} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg sm:text-xl">{course.grade}</span>
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 font-medium text-sm sm:text-base">{courseDetails?.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                      <span className="text-slate-500 text-xs sm:text-sm">{courseDetails?.code}</span>
                      <span className="text-emerald-600 text-xs sm:text-sm">• {course.creditUnit} units</span>
                    </div>
                  </div>

                  {/* Stats - Desktop only */}
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-slate-900 font-semibold">{course.gradePoint}.0</div>
                      <div className="text-slate-500 text-xs">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-600 font-semibold">{(course.gradePoint * course.creditUnit).toFixed(0)}</div>
                      <div className="text-slate-500 text-xs">Total</div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onRemoveCourse(course.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    title="Remove course"
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
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {GRADES.map((grade) => (
              <div key={grade} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${GRADE_COLORS[grade]} flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">{grade}</span>
                </div>
                <span className="text-slate-700">{GRADE_SYSTEM[grade]}.0</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
  );
}
