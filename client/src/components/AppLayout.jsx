import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Target,
  Handshake,
  CheckSquare,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/leads", label: "Leads", icon: Target },
  { to: "/deals", label: "Deals", icon: Handshake },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
];

const AppLayout = ({ children, onOpenAssistant }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen relative flex bg-slate-50 overflow-hidden">
      {/* Aurora backdrop — soft blurred color fields drifting behind the glass */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-300/40 blur-[110px] animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full bg-fuchsia-200/40 blur-[110px] animate-[pulse_11s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-200/50 blur-[110px] animate-[pulse_13s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 h-[18rem] w-[18rem] rounded-full bg-amber-200/30 blur-[100px]" />
      </div>

      {/* Floating glass sidebar */}
      <aside className="w-72 shrink-0 m-4 mr-0 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgba(99,102,241,0.10)] flex flex-col overflow-hidden">
        {/* Logo Section */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/50">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center font-display font-black text-white text-xs tracking-wider shadow-lg shadow-sky-400/30">
            CRM
          </div>
          <div>
            <span className="font-display font-bold text-base tracking-tight text-slate-800 block">Workspace</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto scrollbar-none">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/70 text-sky-600 font-semibold shadow-sm border border-white/80"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/40 border border-transparent"
                }`
              }
            >
              <Icon
                size={18}
                strokeWidth={2}
                className="opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-transform"
              />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Action Panel (Ask AI Widget) */}
        <div className="px-4 pb-4">
          <button
            onClick={onOpenAssistant}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-400/25 hover:shadow-sky-400/40 hover:scale-[1.01] transition-all duration-200 active:scale-[0.98]"
          >
            <Sparkles size={16} strokeWidth={2.5} />
            <span>Ask AI Assistant</span>
          </button>
        </div>

        {/* User Card footer */}
        <div className="px-4 py-4 border-t border-white/50 bg-white/20 flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-sky-100/80 text-sky-600 border border-sky-200/60 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate leading-none mb-1 text-slate-800">{user?.name}</p>
            <p className="text-xs font-medium text-slate-400 truncate leading-none">{user?.role || "Team Member"}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-white/50 transition-all"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <main className="flex-1 min-w-0 overflow-y-auto relative p-4">
        <div className="h-full w-full rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 shadow-[0_8px_40px_rgba(99,102,241,0.06)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;