"use client";

import { useState } from "react";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

const DEFAULT_BUDGET = {
  needs: { Rent: 1900, Utilities: 130, Groceries: 380, Transportation: 127, Insurance: 90, "Min. Debt Payments": 0, Phone: 75 },
  wants: { "Dining Out": 280, Entertainment: 90, Subscriptions: 45, Shopping: 120, Travel: 175, Gym: 45 },
  savings: { "Emergency Fund": 350, "Student Loans (Extra)": 0, Investing: 450, "Short-Term Goals": 150 },
};

export default function BudgetPage() {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [activeTab, setActiveTab] = useState<"needs" | "wants" | "savings">("needs");
  const monthlyIncome = 5910; // would come from user data

  const tabs = [
    { key: "needs" as const, label: "Needs (50%)", target: 0.5 },
    { key: "wants" as const, label: "Wants (30%)", target: 0.3 },
    { key: "savings" as const, label: "Savings (20%)", target: 0.2 },
  ];

  const totalAll = Object.values(budget).reduce((sum, cat) => sum + Object.values(cat).reduce((s, v) => s + v, 0), 0);
  const remaining = monthlyIncome - totalAll;

  const updateCategory = (cat: keyof typeof budget, item: string, value: number) => {
    setBudget({ ...budget, [cat]: { ...budget[cat], [item]: value } });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Budget Builder</h1>
      <p className="text-slate-400 mt-1 mb-6">Allocate your take-home pay using the 50/30/20 framework.</p>

      {/* Unallocated banner */}
      <div className={`border-l-4 rounded-xl p-4 mb-6 ${remaining >= 0 ? "bg-green/10 border-l-green" : "bg-red/10 border-l-red"}`}>
        <div className="flex justify-between items-center">
          <span>Monthly Take-Home: <strong>{fmt(monthlyIncome)}</strong></span>
          <span className={`font-bold ${remaining >= 0 ? "text-green" : "text-red"}`}>
            {remaining >= 0 ? `${fmt(remaining)} unallocated` : `${fmt(Math.abs(remaining))} over budget`}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? "bg-slate-700 shadow-sm text-white font-semibold" : "text-slate-400 hover:text-white"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category inputs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(budget[activeTab]).map(([name, amount]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-slate-400 mb-1">{name}</label>
            <input type="number" value={amount} onChange={(e) => updateCategory(activeTab, name, +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
        ))}
      </div>

      {/* Summary */}
      <hr className="border-slate-700/50 mb-6" />
      <h2 className="text-lg font-bold text-white mb-4">Budget Summary</h2>
      <div className="grid grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const total = Object.values(budget[tab.key]).reduce((s, v) => s + v, 0);
          const target = monthlyIncome * tab.target;
          const pct = totalAll > 0 ? (total / totalAll * 100) : 0;
          return (
            <div key={tab.key} className="card p-4">
              <p className="text-sm text-slate-400 font-medium">{tab.label}</p>
              <p className="text-xl font-bold">{fmt(total)}</p>
              <p className="text-xs text-slate-400">Guideline: {fmt(target)} · Actual: {pct.toFixed(0)}%</p>
              <div className="bg-slate-800/50 rounded-full h-2 mt-2">
                <div className={`h-full rounded-full transition-all ${total <= target ? "bg-green" : "bg-red"}`}
                  style={{ width: `${Math.min(total / target * 100, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
