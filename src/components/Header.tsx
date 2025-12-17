import { GraduationCap, User } from 'lucide-react';

interface HeaderProps {
  matricNumber: string;
  onSwitchUser: () => void;
}

export function Header({ matricNumber, onSwitchUser }: HeaderProps) {
  return (
    <header className="relative z-10 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UNILAG MIT</h1>
              <p className="text-sm text-emerald-200">GPA Calculator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm font-medium">{matricNumber}</span>
            </div>
            <button
              onClick={onSwitchUser}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Switch User"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
