import { BookOpen, Layers, Award, Target } from 'lucide-react';

interface StatsGridProps {
  coursesCount: number;
  totalUnitsTaken: number;
  totalUnitsPassed: number;
  totalGradePoints: number;
}

export function StatsGrid({ coursesCount, totalUnitsTaken, totalUnitsPassed, totalGradePoints }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 col-span-12 lg:col-span-12">
      <div className="bento-item group cursor-default">
        <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/5 group-hover:bg-emerald-500/20 transition-colors">
          <BookOpen className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-left">{coursesCount}</div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Courses</div>
      </div>
      
      <div className="bento-item group cursor-default">
        <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-colors">
          <Layers className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-left">{totalUnitsTaken}</div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Units</div>
      </div>
      
      <div className="bento-item group cursor-default">
        <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
          <Award className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-left">{totalUnitsPassed}</div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Units Passed</div>
      </div>
      
      <div className="bento-item group cursor-default">
        <div className="absolute top-3 right-3 p-2 rounded-xl bg-white/5 group-hover:bg-amber-500/20 transition-colors">
          <Target className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform origin-left">{totalGradePoints.toFixed(0)}</div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Grade Points</div>
      </div>
    </div>
  );
}
