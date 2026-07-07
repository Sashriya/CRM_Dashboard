import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, Calendar, ListTodo } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import { Field, Input, Select, Textarea, Button } from "../components/FormControls.jsx";
import { tasksApi } from "../api/resources.js";

const emptyForm = { title: "", description: "", dueDate: "", priority: "medium", status: "pending" };

const priorityColors = {
  low: "bg-slate-500/10 text-slate-500 border border-slate-300/30",
  medium: "bg-indigo-500/10 text-indigo-600 border border-indigo-300/40",
  high: "bg-rose-500/10 text-rose-600 border border-rose-300/40",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await tasksApi.list(filter !== "all" ? { status: filter } : {});
      setTasks(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch tasks index");
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task.priority,
      status: task.status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await tasksApi.update(editing._id, form);
        toast.success("Task updated");
      } else {
        await tasksApi.create(form);
        toast.success("Task created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await tasksApi.remove(id);
      toast.success("Task deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item");
    }
  };

  const toggleComplete = async (task) => {
    try {
      const targetStatus = task.status === "completed" ? "pending" : "completed";
      await tasksApi.update(task._id, { status: targetStatus });
      // Micro-optimizing response feedback inside row stack indices
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: targetStatus } : t)));
      toast.success(targetStatus === "completed" ? "Task checked off" : "Task reopened");
      load();
    } catch (err) {
      toast.error("Could not modify check state update parameters");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Tasks Checklist"
        subtitle="Organize, prioritize, and check off actionable operational operations."
        action={
          <Button onClick={openCreate} className="flex items-center gap-2 font-semibold">
            <Plus size={16} strokeWidth={2.5} /> New task
          </Button>
        }
      />

      <div className="px-8 space-y-5">
        {/* Modern Segmented Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 bg-white/40 backdrop-blur-sm p-1 rounded-2xl border border-white/60 w-fit select-none">
          {["all", "pending", "in_progress", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/70"
                  : "text-slate-400 hover:text-slate-700 hover:bg-white/40"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Task Card Base Item Collection Stack Container */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.06)] overflow-hidden divide-y divide-white/50">
          {tasks.map((t) => {
            const isCompleted = t.status === "completed";
            return (
              <div key={t._id} className="px-6 py-4 flex items-center gap-4 group hover:bg-white/30 transition-colors">
                {/* Visual Checkbox Interactor */}
                <button
                  onClick={() => toggleComplete(t)}
                  className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-white/80 bg-white/40 hover:border-indigo-400/60 text-transparent"
                  }`}
                  title={isCompleted ? "Mark pending" : "Mark completed"}
                >
                  <Check size={12} strokeWidth={3.5} className={isCompleted ? "scale-100" : "scale-70"} />
                </button>

                {/* Primary Narrative Text Block */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className={`text-sm font-semibold transition-all duration-150 truncate ${
                    isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
                  }`}>
                    {t.title}
                  </p>
                  {t.description && !isCompleted && (
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl font-medium">{t.description}</p>
                  )}
                  {t.dueDate && (
                    <div className="flex items-center gap-1 text-[11px] font-bold font-mono text-slate-400">
                      <Calendar size={11} className="opacity-70 shrink-0" />
                      <span>Due {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  )}
                </div>

                {/* Attribute Metas Badge Row */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md select-none shrink-0 ${priorityColors[t.priority] || priorityColors.medium}`}>
                  {t.priority}
                </span>

                {/* Inline Mutation Trigger Container Layer */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pl-2">
                  <button
                    onClick={() => openEdit(t)}
                    title="Modify Fields"
                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
                  >
                    <Pencil size={13} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => onDelete(t._id)}
                    title="Remove Task"
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Complete Null Index Layout Card */}
          {tasks.length === 0 && (
            <div className="px-6 py-16 text-center select-none max-w-sm mx-auto space-y-2">
              <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-300/40 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-2">
                <ListTodo size={18} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-slate-700">No task records visible</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                There are no open logs listed inside this section view. Create a new objective target to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Action Sheet Settings Overlay Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Update Task Directives" : "Create New Workflow Task"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Task action item title">
            <Input required placeholder="E.g., Coordinate Q3 enterprise license agreement review" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>

          <Field label="Context overview notes">
            <Textarea rows={3} placeholder="Provide complementary background instructions or metrics tags..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>

          <Field label="Target completion date">
            <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Urgency indexing">
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Urgency</option>
                <option value="high">High Escalation</option>
              </Select>
            </Field>

            <Field label="Workflow current status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Awaiting (Pending)</option>
                <option value="in_progress">Active Progression</option>
                <option value="completed">Completed Target</option>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/60 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="font-semibold">
              {saving ? "Updating Checklist…" : "Save Workflow Assignment"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;