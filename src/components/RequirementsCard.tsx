import { Target } from 'lucide-react';
import { Course } from '../types';

interface RequirementsCardProps {
  passedCompulsoryCourses: Course[];
  totalUnitsPassed: number;
  meetsMinimumUnits: boolean;
  outstandingUnits: number;
}

export function RequirementsCard({
  passedCompulsoryCourses,
  totalUnitsPassed,
  meetsMinimumUnits,
  outstandingUnits
}: RequirementsCardProps) {
  const compulsoryProgress = (passedCompulsoryCourses.length / 13) * 100;
  const unitsProgress = Math.min((totalUnitsPassed / 54) * 100, 100);

  return (
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
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${compulsoryProgress}%` }}
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
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${unitsProgress}%` }}
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
  );
}
