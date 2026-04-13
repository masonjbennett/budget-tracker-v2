"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function IncomePage() {
  const [income, setIncome] = useState({
    gross_salary: 95000,
    state: "New York",
    filing_status: "Single",
    contribution_401k: 6,
    health_insurance: 180,
    hsa: 100,
    bonus_amount: 10000,
    bonus_type: "Annual (spread monthly)",
    student_loan_interest: 0,
    charitable: 0,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const data = await api<any>("/api/take-home", income);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const update = (field: string, value: any) => {
    setIncome((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Income Setup</h1>
      <p className="text-slate-400 mt-1 mb-6">Configure your salary, deductions, and tax situation to calculate your true take-home pay.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Salary & Location</h2>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Annual Gross Salary ($)</label>
            <input type="number" value={income.gross_salary} onChange={(e) => update("gross_salary", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
            <select value={income.state} onChange={(e) => update("state", e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none bg-slate-800/50">
              {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Filing Status</label>
            <select value={income.filing_status} onChange={(e) => update("filing_status", e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none bg-slate-800/50">
              {["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Bonus Type</label>
            <select value={income.bonus_type} onChange={(e) => update("bonus_type", e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none bg-slate-800/50">
              {["None", "Annual (spread monthly)", "Signing (lump sum)"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {income.bonus_type !== "None" && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Bonus Amount ($)</label>
              <input type="number" value={income.bonus_amount} onChange={(e) => update("bonus_amount", +e.target.value)}
                className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Pre-Tax Deductions</h2>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">401(k) Contribution (%)</label>
            <input type="range" min={0} max={100} value={income.contribution_401k}
              onChange={(e) => update("contribution_401k", +e.target.value)}
              className="w-full accent-accent" />
            <p className="text-sm text-slate-400 mt-1">{income.contribution_401k}% = {fmt(income.gross_salary * income.contribution_401k / 100)}/year</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Health Insurance ($/month)</label>
            <input type="number" value={income.health_insurance} onChange={(e) => update("health_insurance", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">HSA Contribution ($/month)</label>
            <input type="number" value={income.hsa} onChange={(e) => update("hsa", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Student Loan Interest ($/year)</label>
            <input type="number" value={income.student_loan_interest} max={2500}
              onChange={(e) => update("student_loan_interest", Math.min(2500, +e.target.value))}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
            <p className="text-xs text-slate-400 mt-1">Max $2,500. Above-the-line deduction.</p>
          </div>
        </div>
      </div>

      <button onClick={calculate} disabled={loading}
        className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50">
        {loading ? "Calculating..." : "Calculate Take-Home"}
      </button>

      {result && (
        <div className="mt-8">
          <hr className="border-slate-700/50 mb-8" />
          <h2 className="text-xl font-bold text-white mb-1">Take-Home Breakdown</h2>
          <p className="text-slate-400 text-sm mb-4">Your estimated net pay after all taxes and deductions.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Annual Gross" value={fmt(result.annual_gross)} />
            <MetricCard label="Total Tax" value={fmt(result.total_tax)} delta={`-${result.effective_rate.toFixed(1)}% effective`} deltaColor="red" />
            <MetricCard label="Annual Take-Home" value={fmt(result.annual_take_home)} />
            <MetricCard label="Monthly Take-Home" value={fmt(result.monthly_take_home)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard label="Federal Tax" value={fmt(result.fed_tax)} delta={`${result.marginal_fed.toFixed(0)}% marginal`} />
            <MetricCard label="State Tax" value={fmt(result.state_tax)} />
            <MetricCard label="FICA" value={fmt(result.fica)} />
            <MetricCard label="401(k) + Pre-Tax" value={fmt(result.pretax)} />
          </div>
        </div>
      )}
    </div>
  );
}
