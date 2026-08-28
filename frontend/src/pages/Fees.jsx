import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { studentId: "", amount: "", dueDate: "", description: "Monthly Academic Tuition" };

export default function Fees({ isOpen }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  function loadInvoices() {
    const endpoint = isAdmin ? "/fees" : `/fees/student/${user.children?.[0] || user._id}`;
    api.get(endpoint)
      .then((res) => setInvoices(res.data.invoices || res.data || []))
      .catch(() => setMessage("Failed to pull billing ledger historical sequences."));
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleCreateInvoice(e) {
    e.preventDefault();
    try {
      await api.post("/fees", form);
      setForm(emptyForm);
      setShowForm(false);
      loadInvoices();
      setMessage("Billing structure deployed to targeted accounts successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not instantiate billing invoice node.");
    }
  }

  async function handleMarkPaid(id) {
    try {
      await api.patch(`/fees/${id}/pay`);
      loadInvoices();
      setMessage("Invoice structure status committed to: 'Paid'.");
    } catch (err) {
      setMessage("Could not clear target fee execution framework.");
    }
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 ease-in-out ${
      isOpen ? "pl-64" : "pl-0 md:pl-16"
    }`}>
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        
        <header className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {isAdmin ? "Tuition & Accounts Receivable" : "Academic Invoices"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {isAdmin ? "Generate institutional student billing scopes, audit settlement velocities, and update payment flags." : "Review upcoming fee commitments, balance breakdowns, and statement updates."}
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowForm((v) => !v)}
              className="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 shadow-lg shadow-indigo-600/10 rounded-xl transition-all active:scale-95 shrink-0"
            >
              {showForm ? "Dismiss Form" : "+ Issue Invoice"}
            </button>
          )}
        </header>

        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 text-sm flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 font-bold">&times;</button>
          </div>
        )}

        {showForm && isAdmin && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-5">Draft Student Bill Configuration</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Student ID String</label>
                  <input
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    placeholder="65f123abc456..."
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Amount Due ($)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="1250"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Due Date Milestone</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Allocation Title</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Laboratory Fees / Term Tuition"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-lg rounded-xl transition-all active:scale-95">
                  Deploy Invoice Node
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800/80">
              <tr>
                <th className="p-4 font-semibold">Allocation Context</th>
                {isAdmin && <th className="p-4 font-semibold">Target Student</th>}
                <th className="p-4 font-semibold">Amount Matrix</th>
                <th className="p-4 font-semibold">Due Date Node</th>
                <th className="p-4 font-semibold">Status Scope</th>
                {isAdmin && <th className="p-4 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 4} className="p-12 text-center text-sm text-slate-500 italic">
                    No records matched inside historical financial logs.
                  </td>
                </tr>
              )}
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-900/30 transition-colors group">
                  <td className="p-4 font-medium text-white">{inv.description}</td>
                  {isAdmin && <td className="p-4 font-mono text-xs text-slate-400">{inv.studentName || inv.studentId}</td>}
                  <td className="p-4 font-mono font-semibold text-slate-100">${inv.amount}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{new Date(inv.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${
                      inv.status === "paid" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right">
                      {inv.status !== "paid" && (
                        <button 
                          onClick={() => handleMarkPaid(inv._id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 border border-emerald-900/30 rounded-lg transition-all active:scale-95"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}