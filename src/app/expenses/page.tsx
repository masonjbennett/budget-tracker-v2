"use client";

import { useState } from "react";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CATEGORIES = ["Rent", "Utilities", "Groceries", "Transportation", "Insurance", "Phone", "Dining Out", "Entertainment", "Subscriptions", "Shopping", "Travel", "Gym", "Emergency Fund", "Investing"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    { id: "1", date: "2026-04-01", amount: 1900, category: "Rent", note: "Monthly rent" },
    { id: "2", date: "2026-04-03", amount: 52.30, category: "Groceries", note: "Trader Joe's" },
    { id: "3", date: "2026-04-05", amount: 45, category: "Dining Out", note: "Dinner with friends" },
    { id: "4", date: "2026-04-07", amount: 127, category: "Transportation", note: "Metro pass" },
    { id: "5", date: "2026-04-09", amount: 89.99, category: "Shopping", note: "Running shoes" },
  ]);
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().slice(0, 10), amount: 0, category: "Groceries", note: "" });

  const addExpense = () => {
    if (newExpense.amount > 0) {
      setExpenses([{ id: Date.now().toString(), ...newExpense }, ...expenses]);
      setNewExpense({ date: new Date().toISOString().slice(0, 10), amount: 0, category: "Groceries", note: "" });
    }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const catSpending: Record<string, number> = {};
  expenses.forEach((e) => { catSpending[e.category] = (catSpending[e.category] || 0) + e.amount; });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Expense Tracker</h1>
      <p className="text-slate-400 mt-1 mb-6">Log expenses, track spending, and spot trends.</p>

      {/* Add expense form */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold text-white mb-3">Add Expense</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Date</label>
            <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Amount ($)</label>
            <input type="number" step="0.01" value={newExpense.amount || ""} onChange={(e) => setNewExpense({ ...newExpense, amount: +e.target.value })}
              className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Category</label>
            <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none bg-slate-800/50">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Note</label>
            <div className="flex gap-2">
              <input value={newExpense.note} onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                className="flex-1 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" placeholder="Optional" />
              <button onClick={addExpense} className="bg-accent text-white px-4 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Total + category breakdown */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Spent</p>
          <p className="text-3xl font-bold text-white">{fmt(total)}</p>
        </div>
      </div>

      {/* Category progress */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {Object.entries(catSpending).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
          <div key={cat} className="card p-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{cat}</span>
              <span className="text-slate-400">{fmt(amount)}</span>
            </div>
            <div className="bg-slate-800/50 rounded-full h-1.5 mt-2">
              <div className="bg-accent h-full rounded-full" style={{ width: `${Math.min(amount / total * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Transaction table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Date</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Category</th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Amount</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider text-xs">Note</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-t border-slate-700/50 hover:bg-slate-800/50/50 transition-colors">
                <td className="px-4 py-3">{e.date}</td>
                <td className="px-4 py-3">{e.category}</td>
                <td className="px-4 py-3 text-right font-medium">{fmt(e.amount)}</td>
                <td className="px-4 py-3 text-slate-400">{e.note}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))} className="text-red hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
