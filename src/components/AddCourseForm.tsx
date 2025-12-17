import { Plus } from 'lucide-react';
import { CourseOption, Grade } from '../types';
import { GRADE_COLORS, GRADES, getCourseById } from '../data/courses';

interface AddCourseFormProps {
  currentCourse: { courseId: string; grade: Grade };
  availableCourses: CourseOption[];
  onCourseChange: (course: { courseId: string; grade: Grade }) => void;
  onAddCourse: () => void;
}

export function AddCourseForm({
  currentCourse,
  availableCourses,
  onCourseChange,
  onAddCourse
}: AddCourseFormProps) {
  const selectedCourse = getCourseById(currentCourse.courseId);

  return (
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
            onChange={(e) => onCourseChange({ ...currentCourse, courseId: e.target.value })}
            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:border-emerald-500 focus:bg-white transition-all duration-200 outline-none appearance-none cursor-pointer"
          >
            <option value="" className="bg-white text-slate-900">Choose course...</option>
            {availableCourses.map(course => (
              <option key={course.id} value={course.id} className="bg-white text-slate-900">
                {course.code} - {course.name} ({course.creditUnit} units)
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-slide-up">
            <div className="text-emerald-700 font-medium text-sm">
              {selectedCourse.name}
            </div>
            <div className="text-emerald-600 text-xs mt-1">
              {selectedCourse.creditUnit} Credit Units
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-700 mb-2">Grade</label>
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {GRADES.map((grade) => (
              <button
                key={grade}
                onClick={() => onCourseChange({ ...currentCourse, grade })}
                className={`py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-colors ${
                  currentCourse.grade === grade
                    ? `bg-gradient-to-br ${GRADE_COLORS[grade]} text-white`
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onAddCourse}
          disabled={!currentCourse.courseId}
          className="btn-premium w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>
    </div>
  );
}
