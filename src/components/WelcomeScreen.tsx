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
        <div className="bento-item p-10 w-full max-w-lg animate-slide-up shadow-2xl relative overflow-hidden group">
          {/* Decorative cinematic lighting */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-1000" />
          
          {/* Logo */}
          <div className="text-center mb-10 relative z-10">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-subtle shadow-2xl shadow-emerald-500/40 relative z-10 transform transition-transform group-hover:scale-105">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                {/* Glow behind logo */}
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40 animate-pulse-glow" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-spin-slow shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-300 animate-gradient mb-3 tracking-tight">
                Welcome
              </h1>
              <p className="text-emerald-400/80 font-medium tracking-widest uppercase text-sm">
                UNILAG MIT Calculator
              </p>
            </div>

          {/* Form */}
          <div className="space-y-8 relative z-10">
            <div className="relative">
              <label htmlFor="matric-number" className="block text-xs font-bold text-emerald-400/70 uppercase tracking-wider mb-3">
                Matriculation Number
              </label>
              <div className="relative group/input">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-0 group-hover/input:opacity-30 transition duration-500 ${hasInput ? 'opacity-30' : ''}`} />
                <input
                  type="text"
                  id="matric-number"
                  className={`relative w-full px-6 py-4 bg-slate-900/50 border ${hasInput && !isValidMatric ? 'border-red-400/50' : 'border-white/10'} rounded-xl text-white placeholder-white/20 focus:border-emerald-500 focus:bg-slate-900/80 transition-all duration-300 outline-none text-xl font-medium tracking-wider backdrop-blur-sm`}
                  placeholder="e.g. 210901000"
                  value={matricNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    onMatricChange(value);
                  }}
                  autoFocus
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-emerald-400 transition-colors">
                  <User className="w-6 h-6" />
                </div>
              </div>
              {hasInput && !isValidMatric && (
                <p className="absolute -bottom-6 left-0 text-sm text-red-400 flex items-center gap-1.5 animate-slide-up">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  Must be exactly 9 digits
                </p>
              )}
            </div>

            <button
              onClick={onLogin}
              disabled={!isValidMatric}
              className={`btn-premium w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-1 ${!isValidMatric ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-none' : ''}`}
            >
              <span className="text-lg">Get Started</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/5 text-center relative z-10">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              Master of Information Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
