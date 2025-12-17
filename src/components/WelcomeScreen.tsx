import { GraduationCap, Sparkles, User, ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
  matricNumber: string;
  onMatricChange: (value: string) => void;
  onLogin: () => void;
}

export function WelcomeScreen({ matricNumber, onMatricChange, onLogin }: WelcomeScreenProps) {
  const isValidMatric = /^\d{9}$/.test(matricNumber);
  const hasInput = matricNumber.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Animated Background Orbs */}
      <div className="orb w-96 h-96 bg-emerald-500 top-0 -left-48 animate-float" />
      <div className="orb w-80 h-80 bg-yellow-500 bottom-20 -right-40 animate-float-delayed" />
      <div className="orb w-64 h-64 bg-blue-500 top-1/2 left-1/4 animate-float" style={{ animationDelay: '-2s' }} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-subtle shadow-lg shadow-emerald-500/30">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome!</h1>
            <p className="text-emerald-700">UNILAG MIT GPA Calculator</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="matric-number" className="block text-sm font-medium text-slate-800 mb-2">
                Matriculation Number
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="matric-number"
                  className={`w-full px-5 py-4 bg-white/10 border-2 ${hasInput && !isValidMatric ? 'border-red-400/50' : 'border-white/20'
                    } rounded-xl text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white/80 transition-all duration-300 outline-none text-lg`}
                  placeholder="Enter 9-digit matric number"
                  value={matricNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    onMatricChange(value);
                  }}
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-white/40" />
                </div>
              </div>
              {hasInput && !isValidMatric && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full" />
                  Must be exactly 9 digits
                </p>
              )}
            </div>

            <button
              onClick={onLogin}
              className="btn-premium w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-slate-600 text-sm">
              Master of Information Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
