import { ActionFeedback } from '../types';

interface ActionFeedbackModalProps {
  feedback: ActionFeedback | null;
  onClose: () => void;
}

export function ActionFeedbackModal({ feedback, onClose }: ActionFeedbackModalProps) {
  if (!feedback) return null;

  const iconMap: Record<string, string> = {
    start: '🎮',
    math_lab: '🧪',
    performance: '🏆',
    settings: '⚙️',
  };

  return (
    <div
      id="feedback-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        id="feedback-modal-content"
        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-center transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-inner">
          {iconMap[feedback.type] || '✨'}
        </div>

        <h2
          id="feedback-modal-title"
          className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-2"
        >
          {feedback.title}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-medium">
          {feedback.message}
        </p>

        <button
          id="btn-close-feedback-modal"
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base cursor-pointer shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
        >
          Faham, Terima Kasih!
        </button>
      </div>
    </div>
  );
}
