const PageHeader = ({ title, subtitle, action, divider = false }) => {
  return (
    <div className={`w-full bg-white/20 backdrop-blur-sm rounded-t-3xl ${divider ? "border-b border-white/50" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 pt-8 pb-6 max-w-[1600px] mx-auto">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-2xl font-bold text-slate-800 tracking-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-medium text-slate-500 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2.5 shrink-0 sm:self-center self-start">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;