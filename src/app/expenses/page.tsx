"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const CATEGORIES = ["Rent","Utilities","Groceries","Transportation","Insurance","Phone","Dining Out","Entertainment","Subscriptions","Shopping","Travel","Gym","Emergency Fund","Investing"];

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
      <PageHeader title="Expense Tracker" description="Log expenses, track spending against your budget, and spot trends." />

      {/* Add form */}
      <div className="card mb-6">
        <h3 className="text-[0.85rem] font-semibold text-white mb-3">Add Expense</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div><label className="block text-[0.68rem] text-slate-500 mb-1">Date</label>
            <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} /></div>
          <div><label className="block text-[0.68rem] text-slate-500 mb-1">Amount</label>
            <input type="number" step="0.01" placeholder="0.00" value={newExpense.amount || ""} onChange={(e) => setNewExpense({...newExpense, amount: +e.target.value})} /></div>
          <div><label className="block text-[0.68rem] text-slate-500 mb-1">Category</label>
            <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-[0.68rem] text-slate-500 mb-1">Note</label>
            <input placeholder="Optional" value={newExpense.note} onChange={(e) => setNewExpense({...newExpense, note: e.target.value})} /></div>
          <div className="flex items-end"><button onClick={addExpense} className="btn-primary w-full py-[0.625rem]">Add</button></div>
        </div>
      </div>

      {/* Total */}
      <div className="card bg-gradient-to-r from-blue-500/5 to-transparent border-blue-500/10 mb-6">
        <p className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-500 font-medium">Total Spent</p>
        <p className="text-[2rem] font-bold text-white font-num">{fmt(total)}</p>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {Object.entries(catSpending).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
          <div key={cat} className="card py-3 px-4">
            <div className="flex justify-between text-[0.82rem]">
              <span className="text-slate-300 font-medium">{cat}</span>
              <span className="font-num text-slate-400">{fmt(amount)}</span>
            </div>
            <div className="progress-track mt-2">
              <div className="progress-fill bg-accent" style={{ width: `${Math.min(amount / total * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <table>
          <thead>
            <tr>
              <th className="pl-5">Date</th>
              <th>Category</th>
              <th className="text-right">Amount</th>
              <th>Note</th>
              <th className="pr-5 text-right w-16"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="pl-5 font-num text-slate-400">{e.date}</td>
                <td className="text-slate-300">{e.category}</td>
                <td className="text-right font-num text-white font-medium">{fmt(e.amount)}</td>
                <td className="text-slate-500">{e.note}</td>
                <td className="pr-5 text-right">
                  <button onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))} className="text-[0.72rem] text-slate-600 hover:text-red transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
