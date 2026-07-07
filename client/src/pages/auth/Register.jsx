import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { Field, Input, Select, Button } from "../../components/FormControls.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales_rep" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden bg-slate-50">
      {/* Aurora backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-[110px]" />
        <div className="absolute bottom-0 -left-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-200/40 blur-[110px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[20rem] w-[20rem] rounded-full bg-cyan-200/40 blur-[100px]" />
      </div>

      <div className="w-full max-w-sm">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 mb-8 justify-center select-none">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center font-display font-black text-white text-sm shadow-lg shadow-sky-400/25">
            R
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800">Register</span>
        </div>

        {/* Content Card Panel */}
        <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_rgba(99,102,241,0.15)] p-8">
          <div className="mb-6">
            <h1 className="font-display text-xl font-bold tracking-tight text-slate-800">Create your workspace</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Start managing leads with AI on your side</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Full name">
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full"
              />
            </Field>

            <Field label="Email address">
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full"
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full"
              />
            </Field>

            <Field label="Role">
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full"
              >
                <option value="sales_rep">Sales Rep</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Select>
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 font-semibold"
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        {/* Footer Redirect Prompt */}
        <p className="text-center text-sm font-medium text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 font-semibold hover:text-sky-500 transition-colors underline underline-offset-4 decoration-sky-300/50 hover:decoration-sky-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;