import { useRef, useState } from 'react';
import { Sparkles, Share2, Check } from 'lucide-react';
import { GraduationStatus } from '../types';
import html2canvas from 'html2canvas';

interface GpaDisplayProps {
  gpa: number;
  gpaClass: string;
  graduationStatus: GraduationStatus;
}

export function GpaDisplay({ gpa, gpaClass, graduationStatus }: GpaDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
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

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    
    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1e293b',
        scale: 2,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        // Try native share first (mobile)
        if (navigator.share) {
          const file = new File([blob], `GPA_${gpa.toFixed(2)}.png`, { type: 'image/png' });
          try {
            await navigator.share({
              title: 'My GPA Result',
              text: `I scored ${gpa.toFixed(2)} GPA (${gpaClass}) in UNILAG MIT Programme! 🎓`,
              files: [file]
            });
          } catch (err) {
            // User cancelled or share failed, fallback to download
            downloadImage(blob);
          }
        } else {
          // Fallback: Download the image
          downloadImage(blob);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to capture screenshot:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UNILAG_MIT_GPA_${gpa.toFixed(2)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div id="gpa-display-card" ref={cardRef} className="bento-item col-span-12 lg:col-span-12 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center w-full relative z-10">
          {/* Circular Progress & Giant GPA Number */}
          <div className="relative inline-flex items-center justify-center w-64 h-64 mb-6">
            {/* SVG Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                className="transition-all duration-1000 ease-out"
              />
              {/* Progress track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={gpa >= 4.50 ? '#10b981' : gpa >= 2.40 ? '#3b82f6' : gpa >= 1.50 ? '#f97316' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(gpa / 5) * 283} 283`}
                className="transition-all duration-1000 ease-out animate-pulse-glow"
              />
            </svg>

            {/* Inner Content */}
            <div className="flex flex-col items-center justify-center absolute inset-0">
              <div className={`text-6xl font-black bg-gradient-to-br ${getGpaGradient()} bg-clip-text text-transparent`}>
                {gpa.toFixed(2)}
              </div>
              <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">out of 5.0</div>
            </div>

            {gpa >= 4.50 && (
              <div className="absolute top-0 right-0 animate-spin-slow">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
            )}
          </div>
          
          {/* GPA Class Badge */}
          {gpa > 0 && (
            <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r ${getClassBadgeColors()} shadow-xl backdrop-blur-md mb-6 transition-transform hover:scale-105 cursor-default`}>
              <span className={`font-bold ${getClassTextColor()} tracking-wide`}>
                {gpaClass}
              </span>
            </div>
          )}
        </div>

        {/* Gamification / Next Milestone */}
        {gpa > 0 && gpa < 4.50 && (
          <div className="w-full mt-2 pt-6 border-t border-white/5">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Next Milestone:</span> Keep pushing! You're on your way to the next class.
              </p>
            </div>
          </div>
        )}

        {/* Graduation Status */}
        <div className="w-full mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-colors hover:bg-white/10">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getStatusBgGradient()}`}>
              <StatusIcon className={`w-6 h-6 ${graduationStatus.color}`} />
            </div>
            <div className="flex-1 text-left">
              <div className={`font-bold text-lg ${graduationStatus.color}`}>{graduationStatus.status}</div>
              <div className="text-sm text-slate-400">{graduationStatus.description}</div>
            </div>
          </div>
        </div>

        {/* Branding for screenshot */}
        {gpa > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5 text-center w-full">
            <div className="text-xs text-slate-500 font-medium tracking-wide">UNILAG MIT GPA Calculator</div>
          </div>
        )}
      </div>

      {/* Share Button */}
      {gpa > 0 && (
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
          title="Share your GPA"
        >
          {showCopied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : isSharing ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
          )}
        </button>
      )}
    </div>
  );
}
