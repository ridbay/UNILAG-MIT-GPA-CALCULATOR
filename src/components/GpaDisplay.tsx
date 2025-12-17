import { Sparkles } from 'lucide-react';
import { GraduationStatus } from '../types';

interface GpaDisplayProps {
  gpa: number;
  gpaClass: string;
  graduationStatus: GraduationStatus;
}

export function GpaDisplay({ gpa, gpaClass, graduationStatus }: GpaDisplayProps) {
  const StatusIcon = graduationStatus.icon;

  const getGpaGradient = () => {
    if (gpa >= 4.50) return 'from-emerald-300 via-emerald-400 to-emerald-500';
    if (gpa >= 2.40) return 'from-blue-300 via-blue-400 to-blue-500';
    if (gpa >= 1.50) return 'from-orange-300 via-orange-400 to-orange-500';
    return 'from-red-300 via-red-400 to-red-500';
  };

  const getClassBadgeColors = () => {
    if (gpa >= 4.50) return 'from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30';
    if (gpa >= 2.40) return 'from-blue-500/20 to-blue-600/20 border border-blue-500/30';
    return 'from-orange-500/20 to-orange-600/20 border border-orange-500/30';
  };

  const getClassTextColor = () => {
    if (gpa >= 4.50) return 'text-emerald-700';
    if (gpa >= 2.40) return 'text-blue-700';
    return 'text-orange-700';
  };

  const getStatusBgGradient = () => {
    if (gpa >= 4.50) return 'from-emerald-500/20 to-emerald-600/20';
    if (gpa >= 2.40) return 'from-blue-500/20 to-blue-600/20';
    return 'from-gray-500/20 to-gray-600/20';
  };

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="text-center">
        {/* Giant GPA Number */}
        <div className="relative inline-block mb-4">
          <div className={`text-7xl font-black bg-gradient-to-br ${getGpaGradient()} bg-clip-text text-transparent`}>
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
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getClassBadgeColors()}`}>
            <span className={`font-semibold ${getClassTextColor()}`}>
              {gpaClass}
            </span>
          </div>
        )}
      </div>

      {/* Graduation Status */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getStatusBgGradient()}`}>
            <StatusIcon className={`w-5 h-5 ${graduationStatus.color}`} />
          </div>
          <div>
            <div className={`font-semibold ${graduationStatus.color}`}>{graduationStatus.status}</div>
            <div className="text-xs text-slate-600">{graduationStatus.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
