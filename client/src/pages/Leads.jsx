import { useEffect, useState } from "react";
import { Plus, Sparkles, Pencil, Trash2, Mail, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import SignalRing from "../components/SignalRing.jsx";
import { Field, Input, Select, Button } from "../components/FormControls.jsx";
import { leadsApi, aiApi } from "../api/resources.js";

const emptyForm = { name: "", email: "", company: "", source: "other", status: "new", value: 0 };

const statusColors = {
  new: "bg-slate-500/10 text-slate-600 border border-slate-300/40",
  contacted: "bg-indigo-500/10 text-indigo-600 border border-indigo-300/40",
  qualified: "bg-emerald-500/10 text-emerald-600 border border-emerald-300/40",
  unqualified: "bg-rose-500/10 text-rose-600 border border-rose-300/40",
  converted: "bg-amber-500/10 text-amber-600 border border-amber-300/40",
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [scoringId, setScoringId] = useState(null);
  const [emailModal, setEmailModal] = useState(null);
  const [emailDraft, setEmailDraft] = useState("");
  const [draftingEmail, setDraftingEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    const res = await leadsApi.list();
    setLeads(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (lead) => {
    setEditing(lead);
    setForm({
      name: lead.name,
      email: lead.email || "",
      company: lead.company || "",
      source: lead.source,
      status: lead.status,
      value: lead.value || 0,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await leadsApi.update(editing._id, form);
        toast.success("Lead updated");
      } else {
        await leadsApi.create(form);
        toast.success("Lead created");
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
    if (!confirm("Delete this lead?")) return;
    await leadsApi.remove(id);
    toast.success("Lead deleted");
    load();
  };

  const runScore = async (id) => {
    setScoringId(id);
    try {
      await leadsApi.score(id);
      toast.success("AI score updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Scoring failed — check your Groq API key");
    } finally {
      setScoringId(null);
    }
  };

  const openEmailDraft = async (lead) => {
    setEmailModal(lead);
    setEmailDraft("");
    setDraftingEmail(true);
    setCopied(false);
    try {
      const res = await aiApi.emailDraft({
        recipientName: lead.name,
        context: `Lead from ${lead.source}, currently ${lead.status}, at company ${lead.company || "unknown"}.`,
        purpose: "follow-up",
      });
      setEmailDraft(res.data.data.draft);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate email draft");
    } finally {
      setDraftingEmail(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Leads"
        subtitle="Prospects, scored and prioritized by AI."
        action={
          <Button onClick={openCreate} className="flex items-center gap-2 font-semibold">
            <Plus size={16} strokeWidth={2.5} /> New lead
          </Button>
        }
      />

      <div className="px-8">
        <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/60 bg-white/30 select-none">
                  <th className="px-6 py-4 w-[80px]">Signal</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Est. Value</th>
                  <th className="px-6 py-4 w-[120px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50 align-middle">
                {leads.map((l) => (
                  <tr key={l._id} className="hover:bg-white/40 transition-colors group">
                    {/* Ring Action Cell */}
                    <td className="px-6 py-3">
                      <button
                        onClick={() => runScore(l._id)}
                        disabled={scoringId === l._id}
                        className="focus:outline-none focus:ring-2 focus:ring-indigo-400/25 rounded-full transition-all duration-150 active:scale-95 block"
                        title={l.aiSummary || "Click to run AI scoring"}
                      >
                        {scoringId === l._id ? (
                          <div className="h-11 w-11 flex items-center justify-center bg-white/50 border border-white/60 rounded-full">
                            <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <SignalRing score={l.aiScore} />
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-3 font-semibold text-slate-800 truncate max-w-[180px]">{l.name}</td>
                    <td className="px-6 py-3 text-slate-500 font-medium truncate max-w-[180px]">{l.company || <span className="text-slate-300 font-mono">—</span>}</td>
                    <td className="px-6 py-3 text-slate-400 font-medium capitalize">{l.source.replace("_", " ")}</td>

                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg capitalize tracking-tight ${statusColors[l.status]}`}>
                        {l.status}
                      </span>
                    </td>

                    <td className="px-6 py-3 font-bold font-mono text-slate-700">${(l.value || 0).toLocaleString()}</td>

                    {/* Explicit Action Set */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => openEmailDraft(l)}
                          title="Draft follow-up email"
                          className="text-slate-400 hover:text-amber-500 p-1.5 rounded-xl hover:bg-amber-500/10 transition-colors"
                        >
                          <Mail size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => openEdit(l)}
                          title="Edit Lead"
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => onDelete(l._id)}
                          title="Delete Lead"
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center select-none">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="text-sm font-semibold text-slate-700">No pipeline leads</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Populate inbound metrics manually to evaluate predictive analysis metrics via AI.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dynamic Overlay Form Sheet Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Prospect Profile" : "Register New Lead Source"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact name">
              <Input required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email address">
              <Input type="email" placeholder="your@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>

          <Field label="Company organization">
            <Input placeholder="Analytical Engines Corp" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Acquisition source">
              <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                <option value="website">Website Platform</option>
                <option value="referral">Internal Referral</option>
                <option value="cold_call">Cold Call Reach</option>
                <option value="social_media">Social Media Channel</option>
                <option value="event">Industry Event</option>
                <option value="other">Other Outlets</option>
              </Select>
            </Field>
            <Field label="Pipeline status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="new">New Entry</option>
                <option value="contacted">Contacted Outbound</option>
                <option value="qualified">Qualified Prospect</option>
                <option value="unqualified">Unqualified</option>
                <option value="converted">Converted Client</option>
              </Select>
            </Field>
          </div>

          <Field label="Contract target valuation magnitude ($)">
            <Input
              type="number"
              min="0"
              placeholder="12000"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/60 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="font-semibold">
              {saving ? "Saving Record Changes…" : "Save Lead Information"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dynamic Copier Utility AI Drawer Panel Modal */}
      <Modal
        open={!!emailModal}
        onClose={() => setEmailModal(null)}
        title={`AI Generated Smart Reply — For ${emailModal?.name || ""}`}
        width="max-w-xl"
      >
        <div className="space-y-4">
          {draftingEmail ? (
            <div className="flex flex-col items-center gap-3 py-12 justify-center select-none bg-white/30 border border-dashed border-white/60 rounded-2xl">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-400/25">
                <Sparkles size={16} className="text-white animate-spin duration-1000" />
              </div>
              <p className="text-xs font-semibold text-slate-400 tracking-tight">Drafting personalized follow-up structure with Groq AI…</p>
            </div>
          ) : (
            <div className="relative group bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-5 shadow-inner">
              <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {emailDraft || "No background text parameters available..."}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-white/60">
            <Button
              variant="secondary"
              onClick={handleCopy}
              disabled={!emailDraft || draftingEmail}
              className="font-semibold flex items-center gap-2"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
            </Button>
            <Button onClick={() => setEmailModal(null)} className="font-semibold">Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;