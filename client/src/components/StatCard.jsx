const StatCard = ({ label, value, hint, accent = "indigo" }) => {
  // Safe color maps linked to your design system
  const accents = {
    indigo: "text-indigo-600 selection:bg-indigo-500/10",
    signal: "text-amber-500 selection:bg-amber-500/10",
    mint: "text-emerald-500 selection:bg-emerald-500/10",
  };

  const activeAccent = accents[accent] || accents.indigo;

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_20px_rgba(99,102,241,0.06)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] hover:-translate-y-[2px] transition-all duration-200 group flex flex-col justify-between">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
          {label}
        </p>
        <p className={`font-display text-3xl font-bold tracking-tight mt-2.5 transition-transform group-hover:scale-[1.01] origin-left duration-200 ${activeAccent}`}>
          {value}
        </p>
      </div>

      {hint && (
        <p className="text-xs font-medium text-slate-400 mt-3 pt-2 border-t border-white/60 line-clamp-1">
          {hint}
        </p>
      )}
    </div>
  );
};

export default StatCard;