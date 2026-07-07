export const Field = ({ label, children }) => (
  <label className="block mb-4">
    <span className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</span>
    {children}
  </label>
);

export const inputClass =
  "w-full rounded-xl border border-white/70 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white/80 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 transition-all outline-none shadow-sm";

export const Input = (props) => <input {...props} className={`${inputClass} ${props.className || ""}`} />;

export const Select = (props) => (
  <select {...props} className={`${inputClass} ${props.className || ""}`}>
    {props.children}
  </select>
);

export const Textarea = (props) => (
  <textarea {...props} className={`${inputClass} resize-none ${props.className || ""}`} />
);

export const Button = ({ variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md shadow-sky-400/25 hover:shadow-sky-400/40 hover:scale-[1.01] active:scale-[0.98]",
    secondary: "bg-white/50 backdrop-blur-sm border border-white/70 text-slate-600 hover:bg-white/70",
    signal: "bg-gradient-to-r from-sky-300 to-cyan-400 text-white shadow-md shadow-sky-300/25 hover:shadow-sky-300/40",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-white/50",
    danger: "text-rose-600 hover:bg-rose-500/10",
  };
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
};