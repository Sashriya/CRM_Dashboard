import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Trash2 } from "lucide-react";
import { aiApi } from "../api/resources.js";
import toast from "react-hot-toast";

const AIAssistant = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your CRM assistant. Ask me to prioritize your day, draft an email, or think through a deal.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Dynamic textarea height adjustment
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextHistory = [...messages, { role: "user", content: text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await aiApi.chat({
        message: text,
        history: nextHistory.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.data.reply }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "AI assistant is unavailable right now");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! Chat cleared. How can I help you manage your CRM tasks today?",
        },
      ]);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white/50 backdrop-blur-2xl border-l border-white/60 shadow-[-8px_0_40px_rgba(99,102,241,0.15)] flex flex-col transition-all duration-300 ease-in-out ${
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/50 bg-white/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-400/25">
            <Sparkles size={16} className="text-white animate-pulse" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-slate-800 tracking-tight">AI Assistant</p>
            <p className="text-[11px] font-medium text-slate-400">Powered by Groq</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm border backdrop-blur-md transition-all ${
              m.role === "user"
                ? "ml-auto bg-gradient-to-br from-sky-400 to-blue-500 border-white/20 text-white rounded-tr-none shadow-sky-400/20"
                : "bg-white/70 border-white/70 text-slate-700 rounded-tl-none"
            }`}
          >
            {m.content}
          </div>
        ))}

        {/* Animated Loading State */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-md border border-white/70 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-400 w-fit shadow-sm flex items-center gap-2">
            <span className="flex space-x-1">
              <span className="h-1.5 w-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 bg-sky-400 rounded-full animate-bounce"></span>
            </span>
            <span className="text-xs font-medium pl-1">Thinking…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Action Panel */}
      <div className="p-4 border-t border-white/50 bg-white/20">
        <div className="flex items-end gap-2 bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-1.5 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/15 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about a lead, deal, or your day…"
            className="flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-slate-400 text-slate-800 max-h-[120px] scrollbar-none"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center disabled:opacity-30 disabled:scale-100 scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-md shadow-sky-400/20"
          >
            <Send size={14} className="translate-x-[0.5px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;