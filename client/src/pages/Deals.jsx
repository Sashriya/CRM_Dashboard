import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import { Field, Input, Select, Button } from "../components/FormControls.jsx";
import { dealsApi } from "../api/resources.js";

const stages = [
  { key: "prospecting", label: "Prospecting", color: "text-slate-500" },
  { key: "proposal", label: "Proposal", color: "text-indigo-600" },
  { key: "negotiation", label: "Negotiation", color: "text-amber-600" },
  { key: "won", label: "Won", color: "text-emerald-600" },
  { key: "lost", label: "Lost", color: "text-rose-600" },
];

const emptyForm = { title: "", stage: "prospecting", value: 0, closeDate: "" };

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await dealsApi.list();
    setDeals(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = (stage) => {
    setEditing(null);
    setForm({ ...emptyForm, stage: stage || "prospecting" });
    setModalOpen(true);
  };

  const openEdit = (deal) => {
    setEditing(deal);
    setForm({
      title: deal.title,
      stage: deal.stage,
      value: deal.value || 0,
      closeDate: deal.closeDate ? deal.closeDate.slice(0, 10) : "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await dealsApi.update(editing._id, form);
        toast.success("Deal updated");
      } else {
        await dealsApi.create(form);
        toast.success("Deal created");
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
    if (!confirm("Delete this deal?")) return;
    await dealsApi.remove(id);
    toast.success("Deal deleted");
    load();
  };

  const moveStage = async (deal, stage) => {
    await dealsApi.update(deal._id, { stage });
    load();
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Deals Pipeline"
        subtitle="Track, filter, and progress opportunities stage by stage."
        action={
          <Button onClick={() => openCreate()} className="flex items-center gap-2 font-semibold">
            <Plus size={16} strokeWidth={2.5} /> New deal
          </Button>
        }
      />

      {/* Board Scrollable Box */}
      <div className="px-8 overflow-x-auto scrollbar-thin">
        <div className="flex gap-4 min-w-[1150px] items-start pb-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            const total = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

            return (
              <div key={stage.key} className="flex-1 min-w-[220px] bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-3 flex flex-col">
                {/* Column Meta Header */}
                <div className="flex items-center justify-between mb-4 px-1.5 select-none">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-[10px] bg-white/60 px-2 py-0.5 rounded-full font-bold text-slate-500">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-500">
                    ${total.toLocaleString()}
                  </span>
                </div>

                {/* Deal Item Stack */}
                <div className="space-y-2.5 min-h-[350px]">
                  {stageDeals.map((d) => (
                    <div key={d._id} className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:border-white/90 transition-all group relative">
                      <p className="text-sm font-semibold text-slate-800 leading-snug mb-1.5 truncate pr-8">
                        {d.title}
                      </p>

                      <div className="flex items-center gap-1 text-sm font-bold font-mono text-indigo-600 mb-3">
                        <DollarSign size={14} className="opacity-60 -mr-0.5 shrink-0" />
                        <span>{(d.value || 0).toLocaleString()}</span>
                      </div>

                      {d.closeDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3.5 bg-white/50 w-fit px-2 py-1 rounded-lg border border-white/60">
                          <Calendar size={12} className="shrink-0" />
                          <span>Close {new Date(d.closeDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        </div>
                      )}

                      {/* Interaction Footer Controls */}
                      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/60">
                        <select
                          value={d.stage}
                          onChange={(e) => moveStage(d, e.target.value)}
                          className="text-xs font-medium text-slate-500 border border-white/70 rounded-lg px-2 py-1 bg-white/60 hover:bg-white/80 outline-none cursor-pointer transition-colors"
                        >
                          {stages.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3.5 right-3 bg-white/70 backdrop-blur-sm pl-1.5 rounded-lg">
                          <button
                            onClick={() => openEdit(d)}
                            title="Edit Deal"
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded-md hover:bg-indigo-500/10 transition-colors"
                          >
                            <Pencil size={12} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => onDelete(d._id)}
                            title="Delete Deal"
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty Column Actions Link */}
                  <button
                    onClick={() => openCreate(stage.key)}
                    className="w-full text-xs font-semibold text-slate-400 hover:text-indigo-600 border border-dashed border-white/70 hover:border-indigo-400/50 rounded-2xl py-3 hover:bg-white/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} strokeWidth={2.5} /> Add deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Overlay Form Sheet Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Pipeline Item" : "Create New Pipeline Opportunity"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Deal reference title">
            <Input required placeholder="E.g., Enterprise SaaS Expansion License" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Pipeline stage placement">
              <Select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                {stages.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Deal value magnitude ($)">
              <Input
                type="number"
                min="0"
                placeholder="50000"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Target close timeline estimate">
            <Input
              type="date"
              value={form.closeDate}
              onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/60 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="font-semibold">
              {saving ? "Updating Pipeline…" : "Save Pipeline Record"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Deals;