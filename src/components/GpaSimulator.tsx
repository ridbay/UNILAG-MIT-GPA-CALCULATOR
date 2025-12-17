import { useState, useMemo } from 'react';
import { Target, Calculator, Sparkles } from 'lucide-react';

interface GpaSimulatorProps {
  currentGpa: number;
  totalUnits: number;
}

export function GpaSimulator({ currentGpa, totalUnits }: GpaSimulatorProps) {
  const [targetGpa, setTargetGpa] = useState<string>('4.50');
  const [additionalUnits, setAdditionalUnits] = useState<string>('12');

  // Calculate what's needed to reach target GPA
  const simulation = useMemo(() => {
    const target = parseFloat(targetGpa) || 0;
    const addUnits = parseInt(additionalUnits) || 0;
    
    if (target <= 0 || target > 5 || addUnits <= 0) {
      return null;
    }

    const currentTotalPoints = currentGpa * totalUnits;
    const newTotalUnits = totalUnits + addUnits;
    const requiredTotalPoints = target * newTotalUnits;
    const requiredNewPoints = requiredTotalPoints - currentTotalPoints;
    const requiredAvgGrade = requiredNewPoints / addUnits;

    // Determine if it's achievable
    const isAchievable = requiredAvgGrade <= 5.0;

    // Determine grade needed
    let gradeNeeded = 'N/A';
    let gradeColor = 'text-slate-500';
    
    if (requiredAvgGrade >= 5.0) {
      gradeNeeded = 'All A\'s';
      gradeColor = 'text-emerald-600';
    } else if (requiredAvgGrade >= 4.0) {
      gradeNeeded = 'A-B Average';
      gradeColor = 'text-blue-600';
    } else if (requiredAvgGrade >= 3.0) {
      gradeNeeded = 'B-C Average';
      gradeColor = 'text-cyan-600';
    } else if (requiredAvgGrade >= 2.0) {
      gradeNeeded = 'C-D Average';
      gradeColor = 'text-amber-600';
    } else if (requiredAvgGrade >= 1.0) {
      gradeNeeded = 'D-E Average';
      gradeColor = 'text-orange-600';
    } else if (requiredAvgGrade >= 0) {
      gradeNeeded = 'Just Pass';
      gradeColor = 'text-red-600';
    }

    return {
      requiredAvgGrade: Math.max(0, requiredAvgGrade),
      isAchievable,
      gradeNeeded,
      gradeColor,
      currentGpa,
      targetGpa: target,
      additionalUnits: addUnits,
      projectedGpa: isAchievable ? target : (currentTotalPoints + (5.0 * addUnits)) / newTotalUnits
    };
  }, [targetGpa, additionalUnits, currentGpa, totalUnits]);

  // Quick target buttons
  const quickTargets = [
    { label: 'Pass', value: '2.40', color: 'bg-blue-100 text-blue-700' },
    { label: 'Distinction', value: '4.50', color: 'bg-emerald-100 text-emerald-700' },
    { label: '5.0', value: '5.00', color: 'bg-amber-100 text-amber-700' },
  ];

  if (totalUnits === 0) {
    return null; // Don't show if no courses added yet
  }

  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-purple-600" />
        GPA Goal Simulator
      </h3>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="p-3 bg-slate-100 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Current GPA</div>
          <div className="text-2xl font-bold text-slate-900">{currentGpa.toFixed(2)}</div>
          <div className="text-xs text-slate-500">{totalUnits} units completed</div>
        </div>

        {/* Quick Target Buttons */}
        <div>
          <label className="block text-xs text-slate-600 mb-2">Quick Targets</label>
          <div className="flex gap-2">
            {quickTargets.map((qt) => (
              <button
                key={qt.value}
                onClick={() => setTargetGpa(qt.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  targetGpa === qt.value ? qt.color : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {qt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target GPA Input */}
        <div>
          <label className="block text-xs text-slate-600 mb-2">Target GPA</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={targetGpa}
            onChange={(e) => setTargetGpa(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-500 outline-none"
            placeholder="e.g., 4.50"
          />
        </div>

        {/* Additional Units Input */}
        <div>
          <label className="block text-xs text-slate-600 mb-2">Additional Units to Take</label>
          <input
            type="number"
            min="1"
            max="100"
            value={additionalUnits}
            onChange={(e) => setAdditionalUnits(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-purple-500 outline-none"
            placeholder="e.g., 12"
          />
        </div>

        {/* Result */}
        {simulation && (
          <div className={`p-4 rounded-xl ${simulation.isAchievable ? 'bg-purple-50 border border-purple-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              {simulation.isAchievable ? (
                <Sparkles className="w-5 h-5 text-purple-600" />
              ) : (
                <Calculator className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${simulation.isAchievable ? 'text-purple-700' : 'text-red-700'}`}>
                {simulation.isAchievable ? 'Achievable!' : 'Not Achievable'}
              </span>
            </div>

            {simulation.isAchievable ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Required Average Grade:</span>
                  <span className={`font-bold ${simulation.gradeColor}`}>
                    {simulation.requiredAvgGrade.toFixed(2)} ({simulation.gradeNeeded})
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  You need to average <strong>{simulation.requiredAvgGrade.toFixed(2)}</strong> grade points 
                  across your next <strong>{simulation.additionalUnits}</strong> units to reach a 
                  <strong> {simulation.targetGpa.toFixed(2)}</strong> GPA.
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-600">
                Even with all A's in your next {simulation.additionalUnits} units, 
                your maximum possible GPA would be {simulation.projectedGpa.toFixed(2)}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
