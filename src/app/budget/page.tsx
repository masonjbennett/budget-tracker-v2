"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function BudgetPage() {
  const { data, takeHome, updateBudget } = useFinance();
  const budget = data.budget;
  const [activeTab, setActiveTab] = useState<"needs" | "wants" | "savings">("needs");
  const monthlyIncome = takeHome?.monthly_take_home || 0;

  const tabs = [
    { key: "needs" as const, label: "Needs", pct: "50%", target: 0.5 },
    { key: "wants" as const, label: "Wants", pct: "30%", target: 0.3 },
    { key: "savings" as const, label: "Savings", pct: "20%", target: 0.2 },
  ];

  const totalAll = Object.values(budget).reduce((sum, cat) => sum + Object.values(cat).reduce((s, v) => s + v, 0), 0);
  const remaining = monthlyIncome - totalAll;

  const updateCategory = (item: string, value: number) => {
    updateBudget(activeTab, { ...budget[activeTab], [item]: value });
  };

  return (
    <div>
      <PageHeader title="Budget Builder" description="Allocate your take-home pay — changes save automatically." />

      <div className={`card mb-6 ${remaining >= 0 ? "border-green/20 bg-green/[0.03]" : "border-red/20 bg-red/[0.03]"}`}>
        <div className="flex justify-between items-center">
          <span className="text-[0.85rem] text-slate-300">Monthly Take-Home: <strong className="text-white font-num">{fmt(monthlyIncome)}</strong></span>
          <span className={`text-[0.9rem] font-bold font-num ${remaining >= 0 ? "text-green" : "text-red"}`}>
            {remaining >= 0 ? `${fmt(remaining)} unallocated` : `${fmt(Math.abs(remaining))} over budget`}
          </span>
        </div>
      </div>

      <div className="tab-list mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`tab ${activeTab === tab.key ? "tab-active" : ""}`}>
            {tab.label} ({tab.pct})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(budget[activeTab]).map(([name, amount]) => (
          <div key={name}>
            <label className="block text-[0.78rem] font-medium text-slate-400 mb-1.5">{name}</label>
            <input type="number" value={amount} onChange={(e) => updateCategory(name, +e.target.value)} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[1.05rem] font-semibold text-white">Summary</h2>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const total = Object.values(budget[tab.key]).reduce((s, v) => s + v, 0);
          const target = monthlyIncome * tab.target;
          const pct = totalAll > 0 ? (total / totalAll * 100) : 0;
          return (
            <div key={tab.key} className="card">
              <p className="text-[0.78rem] text-slate-400 font-medium">{tab.label} ({tab.pct})</p>
              <p className="text-xl font-bold text-white font-num mt-1">{fmt(total)}</p>
              <p className="text-[0.72rem] text-slate-600 mt-1">Guideline: {fmt(target)} · Actual: {pct.toFixed(0)}%</p>
              <div className="progress-track mt-3">
                <div className={`progress-fill ${total <= target ? "bg-green" : "bg-red"}`} style={{ width: `${Math.min(total / target * 100, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
