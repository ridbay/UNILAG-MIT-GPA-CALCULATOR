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
      <div id="gpa-display-card" ref={cardRef} className="glass rounded-2xl p-6 card-hover">
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
            <div className="flex-1">
              <div className={`font-semibold ${graduationStatus.color}`}>{graduationStatus.status}</div>
              <div className="text-xs text-slate-600">{graduationStatus.description}</div>
            </div>
          </div>
        </div>

        {/* Branding for screenshot */}
        {gpa > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <div className="text-xs text-slate-500">UNILAG MIT GPA Calculator</div>
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
