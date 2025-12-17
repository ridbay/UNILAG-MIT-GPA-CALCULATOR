interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function SaveDialog({ isOpen, onClose, onSave }: SaveDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Save Results</h3>
        <p className="text-slate-700 text-sm mb-6">
          Save your current progress to retrieve it later.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl transition-all duration-200 font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
