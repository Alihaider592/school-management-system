import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { title: "", amount: "", date: "", category: "utilities" };

export default function Expenses({ isOpen }) {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [totalOutflow, setTotalOutflow] = useState(0);

  function loadExpenses() {
    api.get("/expenses").then((res) => {
      const list = res.data.expenses || res.data || [];
      setExpenses(list);
      const sum = list.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      setTotalOutflow(sum);
    }).catch(() => setMessage("Failed to pull outgoings profile configuration."));
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/expenses", form);
      setForm(emptyForm);
      setShowForm(false);
      loadExpenses();
      setMessage("Expense record logged successfully into financial history ledger.");
    } catch (err) {
      setMessage("Failed to register structural outflow parameters.");
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
              Operating Expenditures
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Log facility maintenance, supply acquisitions, utility allocations, and balance metrics.
            </p>
          </div>
          <button 
            onClick={() => setShowForm((v) => !v)}
            className="px-5 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 shadow-lg shadow-rose-600/10 rounded-xl transition-all active:scale-95 shrink-0"
          >
            {showForm ? "Hide Console" : "+ File Expenditure"}
          </button>
        </header>

        {/* Outflow Analytics Display Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden max-w-sm">
          <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">Cumulative Outflow Volume</span>
          <div className="text-3xl font-bold text-rose-400 mt-1">${totalOutflow.toLocaleString()}</div>
        </div>

        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-rose-400 text-sm flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 font-bold">&times;</button>
          </div>
        )}

        {showForm && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-5">File Cost Parameters</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Expense Item Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Server Architecture Hosting"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Capital Outlay ($)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="450"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-all font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Settlement Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category Routing</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                  >
                    <option value="utilities">Utilities & Infrastructure</option>
                    <option value="salaries">Faculty / Staff Salaries</option>
                    <option value="maintenance">Facility Maintenance</option>
                    <option value="supplies">Academic Resources & Supplies</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 shadow-lg rounded-xl transition-all active:scale-95">
                  Authorize Operational Cost
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800/80">
              <tr>
                <th className="p-4 font-semibold">Expenditure Profile</th>
                <th className="p-4 font-semibold">Category Matrix</th>
                <th className="p-4 font-semibold">Date Logged</th>
                <th className="p-4 font-semibold text-right">Outlay Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-sm text-slate-500 italic">
                    No operating expenses recorded within active statement parameters.
                  </td>
                </tr>
              )}
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-medium text-white">{exp.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-slate-950 border border-slate-800 rounded text-slate-400">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-400">{new Date(exp.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                  <td className="p-4 font-mono font-bold text-rose-400 text-right">-${exp.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
