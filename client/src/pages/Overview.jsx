import { useEffect, useState } from "react";
import { Users, Target, Handshake, CheckSquare, Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { contactsApi, leadsApi, dealsApi, tasksApi } from "../api/resources.js";
import { useAuth } from "../context/AuthContext.jsx";

const priorityColors = {
  high: "bg-rose-500/10 text-rose-600 border border-rose-300/40",
  medium: "bg-indigo-500/10 text-indigo-600 border border-indigo-300/40",
  low: "bg-slate-500/10 text-slate-500 border border-slate-300/30",
};

const Overview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [contacts, leads, deals, taskRes] = await Promise.all([
          contactsApi.list(),
          leadsApi.list(),
          dealsApi.list(),
          tasksApi.list({ status: "pending" }),
        ]);

        const pipelineValue = deals.data.data
          .filter((d) => d.stage !== "lost")
          .reduce((sum, d) => sum + (d.value || 0), 0);

        setStats({
          contacts: contacts.data.count,
          leads: leads.data.count,
          deals: deals.data.count,
          pipelineValue,
        });
        setTasks(taskRes.data.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title={`Good to see you, ${firstName || "there"}`}
        subtitle="Here's where things stand across your sales workspace today."
      />

      {/* Primary Metrics Dashboard Deck */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Contacts"
          value={loading ? "—" : stats?.contacts ?? 0}
          hint="Active relationship network"
          accent="indigo"
        />
        <StatCard
          label="Open Leads"
          value={loading ? "—" : stats?.leads ?? 0}
          hint="Awaiting AI pipeline evaluation"
          accent="signal"
        />
        <StatCard
          label="Active Deals"
          value={loading ? "—" : stats?.deals ?? 0}
          hint="Opportunities in progression"
          accent="mint"
        />
        <StatCard
          label="Pipeline Value"
          value={loading ? "—" : stats ? `$${stats.pipelineValue.toLocaleString()}` : "$0"}
          hint="Excluding closed-lost closures"
          accent="indigo"
        />
      </div>

      {/* Queue Task Splitting Section */}
      <div className="px-8 mt-8">
        <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.06)] overflow-hidden">
          {/* Section Sub-Header */}
          <div className="px-6 py-4 border-b border-white/60 flex items-center justify-between select-none bg-white/30">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-indigo-500" />
              <h2 className="font-display font-bold text-sm tracking-tight text-slate-800">Urgent Action Items</h2>
            </div>
            {!loading && tasks.length > 0 && (
              <Link
                to="/tasks"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-0.5 transition-colors"
              >
                <span>View task board</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>

          {/* Core Table Stack Queue */}
          <div className="divide-y divide-white/50">
            {loading ? (
              <div className="px-6 py-12 text-center text-xs font-medium text-slate-400 animate-pulse">
                Fetching critical priority checklist details…
              </div>
            ) : tasks.length === 0 ? (
              <div className="px-6 py-16 text-center select-none max-w-sm mx-auto space-y-2">
                <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-300/40 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-2">
                  <CheckSquare size={18} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-slate-700">You're all caught up</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No active pending assignments match your stack index rules. Time to scout new leads!
                </p>
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/30 transition-colors group">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {t.title}
                    </p>
                    {t.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium font-mono">
                        <Calendar size={12} className="shrink-0 opacity-70" />
                        <span>Due {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md select-none shrink-0 ${priorityColors[t.priority] || priorityColors.low}`}>
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;