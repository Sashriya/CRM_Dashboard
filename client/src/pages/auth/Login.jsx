import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { Field, Input, Button } from "../../components/FormControls.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden bg-slate-50">
      {/* Aurora backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-[110px]" />
        <div className="absolute bottom-0 -right-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-200/40 blur-[110px]" />
        <div className="absolute bottom-1/4 left-1/3 h-[20rem] w-[20rem] rounded-full bg-cyan-200/40 blur-[100px]" />
      </div>

      <div className="w-full max-w-sm">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 mb-8 justify-center select-none">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center font-display font-black text-white text-sm shadow-lg shadow-sky-400/25">
            L
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800">Login</span>
        </div>

        {/* Content Card Panel */}
        <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_rgba(99,102,241,0.15)] p-8">
          <div className="mb-6">
            <h1 className="font-display text-xl font-bold tracking-tight text-slate-800">Welcome back</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Log in to your CRM workspace</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full"
              />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 font-semibold"
            >
              {loading ? "Logging in…" : "Log in to Workspace"}
            </Button>
          </form>
        </div>

        {/* Footer Redirect Prompt */}
        <p className="text-center text-sm font-medium text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-sky-600 font-semibold hover:text-sky-500 transition-colors underline underline-offset-4 decoration-sky-300/50 hover:decoration-sky-500"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;