import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, width = "max-w-lg" }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-indigo-950/20 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${width} bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(99,102,241,0.25)] border border-white/80 overflow-hidden flex flex-col transform transition-transform duration-300 scale-100 animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/50 bg-white/30 backdrop-blur-sm">
          <h3 className="font-display font-semibold text-sm tracking-tight text-slate-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-all"
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-thin text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;