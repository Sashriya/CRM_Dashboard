import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, User, Building } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import { Field, Input, Textarea, Button } from "../components/FormControls.jsx";
import { contactsApi } from "../api/resources.js";

const emptyForm = { name: "", email: "", phone: "", company: "", jobTitle: "", notes: "" };

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async (q) => {
    const res = await contactsApi.list(q ? { search: q } : {});
    setContacts(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditing(contact);
    setForm({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      jobTitle: contact.jobTitle || "",
      notes: contact.notes || "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await contactsApi.update(editing._id, form);
        toast.success("Contact updated");
      } else {
        await contactsApi.create(form);
        toast.success("Contact created");
      }
      setModalOpen(false);
      load(search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this contact?")) return;
    try {
      await contactsApi.remove(id);
      toast.success("Contact deleted");
      load(search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete contact");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Contacts"
        subtitle="Everyone you're building a relationship with."
        action={
          <Button onClick={openCreate} className="flex items-center gap-2 font-semibold">
            <Plus size={16} strokeWidth={2.5} /> New contact
          </Button>
        }
      />

      <div className="px-8">
        {/* Search Toolbar Row */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full max-w-sm group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or email…"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl border border-white/70 bg-white/50 backdrop-blur-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15 focus:bg-white/80 transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500 bg-white/50 backdrop-blur-sm border border-white/60 px-2.5 py-1.5 rounded-xl select-none">
            {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/60 bg-white/30 select-none">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Company & Role</th>
                  <th className="px-6 py-3.5">Email address</th>
                  <th className="px-6 py-3.5">Phone number</th>
                  <th className="px-6 py-3.5 w-[100px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-white/40 transition-colors group">
                    {/* Identity Name Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-200/50 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                          <User size={14} strokeWidth={2.5} />
                        </div>
                        <div className="font-semibold text-slate-800 truncate max-w-[200px]">{c.name}</div>
                      </div>
                    </td>

                    {/* Corporate Metadata Column */}
                    <td className="px-6 py-4">
                      {c.company ? (
                        <div className="space-y-0.5">
                          <div className="text-slate-700 font-medium truncate flex items-center gap-1.5 max-w-[220px]">
                            <Building size={12} className="text-slate-400 shrink-0" />
                            {c.company}
                          </div>
                          {c.jobTitle && <div className="text-xs text-slate-400 truncate max-w-[220px]">{c.jobTitle}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono">—</span>
                      )}
                    </td>

                    {/* Digital Coordinates Columns */}
                    <td className="px-6 py-4 text-slate-500 font-medium truncate max-w-[240px]">{c.email || <span className="text-slate-300 font-mono">—</span>}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium font-mono text-xs">{c.phone || <span className="text-slate-300 font-mono">—</span>}</td>

                    {/* Inline Action Row */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => openEdit(c)}
                          title="Edit Profile"
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => onDelete(c._id)}
                          title="Delete Profile"
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State Block */}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center select-none">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="text-sm font-semibold text-slate-700">No contacts matched</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Start adding metrics manually or adjust search strings to build your network list profiles.
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

      {/* Modal View Block Component */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Profile Settings" : "Create New Contact Profile"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name">
              <Input required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email address">
              <Input type="email" placeholder="name@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone number">
              <Input placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Company entity">
              <Input placeholder="Acme Corp" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
          </div>
          <Field label="Job title role">
            <Input placeholder="VP of Sales Operations" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
          </Field>
          <Field label="Internal background notes">
            <Textarea rows={3} placeholder="Met at industry conference, interested in enterprise custom pipeline options..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/60 mt-6">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="font-semibold">
              {saving ? "Saving Changes…" : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Contacts;