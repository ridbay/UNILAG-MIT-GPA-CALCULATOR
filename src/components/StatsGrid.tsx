interface StatsGridProps {
  coursesCount: number;
  totalUnitsTaken: number;
  totalUnitsPassed: number;
  totalGradePoints: number;
}

export function StatsGrid({ coursesCount, totalUnitsTaken, totalUnitsPassed, totalGradePoints }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass rounded-xl p-4 card-hover">
        <div className="text-3xl font-bold text-slate-900 mb-1">{coursesCount}</div>
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
  );
}
