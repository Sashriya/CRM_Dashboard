import { useEffect, useState } from "react";

const SignalRing = ({ score, size = 44 }) => {
  const [progressOffset, setProgressOffset] = useState(0);

  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = typeof score === "number" ? Math.min(Math.max(score, 0), 100) : 0;

  // Calculate raw offset
  const targetOffset = circumference - (value / 100) * circumference;

  // Handles smooth initial mount animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressOffset(targetOffset);
    }, 50);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  // Determine dynamic Tailwind utility classes instead of hardcoded hex values
  const getColorClasses = (val) => {
    if (val >= 70) return { stroke: "stroke-emerald-500", text: "text-emerald-600 bg-emerald-500/10" };
    if (val >= 40) return { stroke: "stroke-amber-500", text: "text-amber-600 bg-amber-500/10" };
    return { stroke: "stroke-rose-500", text: "text-rose-600 bg-rose-500/10" };
  };

  const hasScore = typeof score === "number";
  const colors = getColorClasses(value);

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-full p-0.5 backdrop-blur-sm border transition-all duration-300 group ${
        hasScore ? `${colors.text} border-white/50` : "bg-white/40 border-white/50"
      }`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform transition-transform group-hover:scale-105 duration-200">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-white/70"
          strokeWidth="3"
        />

        {/* Indicator Progress Ring */}
        {hasScore && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={`${colors.stroke} transition-all`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        )}
      </svg>

      {/* Centered Score text */}
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <span className={`font-mono text-[11px] font-bold tracking-tighter ${hasScore ? "text-slate-700" : "text-slate-300"}`}>
          {hasScore ? score : "—"}
        </span>
      </div>
    </div>
  );
};

export default SignalRing;