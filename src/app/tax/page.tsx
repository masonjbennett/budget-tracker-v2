"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function TaxPage() {
  const [income, setIncome] = useState({
    gross_salary: 95000, state: "New York", filing_status: "Single",
    contribution_401k: 6, health_insurance: 180, hsa: 100,
    bonus_amount: 10000, bonus_type: "Annual (spread monthly)",
    student_loan_interest: 0, charitable: 0,
  });
  const [result, setResult] = useState<any>(null);
  const [rothResult, setRothResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [futureRate, setFutureRate] = useState(15);

  const calculate = async () => {
    setLoading(true);
    try {
      const th = await api<any>("/api/take-home", income);
      setResult(th);
      const roth = await api<any>("/api/roth-vs-traditional", {
        annual_contribution: Math.min(income.gross_salary * income.contribution_401k / 100, 24500),
        current_marginal_rate: th.marginal_fed / 100,
        future_tax_rate: futureRate / 100,
        annual_return: 7.0,
        years: 30,
      });
      setRothResult(roth);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Tax Estimator</h1>
      <p className="text-slate-400 mt-1 mb-2">Estimate your federal and state tax liability, compare deduction strategies, and optimize contributions.</p>
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
        <p className="text-sm text-slate-400">
          All brackets use official <a href="https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" target="_blank" className="text-accent underline">IRS 2026 data</a> (Rev. Proc. 2025-32).
          SALT cap reflects the One Big Beautiful Bill Act ($40,400). State rates updated for 2026 changes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Gross Salary ($)</label>
          <input type="number" value={income.gross_salary} onChange={(e) => setIncome({...income, gross_salary: +e.target.value})}
            className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
          <select value={income.state} onChange={(e) => setIncome({...income, state: e.target.value})}
            className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none bg-slate-800/50">
            {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={calculate} disabled={loading}
        className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 mb-8">
        {loading ? "Calculating..." : "Calculate Taxes"}
      </button>

      {result && (
        <>
          <hr className="border-slate-700/50 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard label="Federal Tax" value={fmt(result.fed_tax)} />
            <MetricCard label="State Tax" value={fmt(result.state_tax)} />
            <MetricCard label="FICA" value={fmt(result.fica)} />
            <MetricCard label="Total Tax" value={fmt(result.total_tax)} delta={`${result.effective_rate.toFixed(1)}% effective`} deltaColor="red" />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="card p-5">
              <h3 className="font-bold text-white mb-2">Tax Rates</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Effective Rate</p>
                  <p className="text-2xl font-bold text-yellow">{result.effective_rate.toFixed(1)}%</p>
                  <p className="text-xs text-slate-400">What you actually pay overall</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Marginal Rate</p>
                  <p className="text-2xl font-bold text-red">{result.marginal_fed.toFixed(0)}%</p>
                  <p className="text-xs text-slate-400">Tax on your next dollar</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-white mb-2">Deduction Breakdown</h3>
              <p className="text-sm text-slate-400">Filing: <strong>{result.filing}</strong></p>
              <p className="text-sm text-slate-400">AGI: <strong>{fmt(result.agi)}</strong></p>
              <p className="text-sm text-slate-400">Standard Deduction: <strong>-{fmt(result.std_ded)}</strong></p>
              <p className="text-sm text-slate-400">Taxable Income: <strong>{fmt(result.taxable)}</strong></p>
            </div>
          </div>
        </>
      )}

      {/* Roth vs Traditional */}
      {rothResult && (
        <>
          <hr className="border-slate-700/50 mb-8" />
          <h2 className="text-xl font-bold text-white mb-1">Roth vs. Traditional 401(k)</h2>
          <p className="text-slate-400 text-sm mb-4">Compare after-tax ending values based on your current vs expected retirement tax rate.</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-1">Expected Retirement Tax Rate (%)</label>
            <input type="number" value={futureRate} min={0} max={50}
              onChange={(e) => setFutureRate(+e.target.value)}
              className="w-32 border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-slate-800/50 border rounded-xl p-5 ${rothResult.better === "Traditional" ? "border-green border-l-4" : "border-slate-700/50"}`}>
              <h3 className="font-bold text-white">Traditional (Pre-Tax)</h3>
              <p className="text-2xl font-bold mt-1">{fmt(rothResult.traditional_after_tax)}</p>
              <p className="text-xs text-slate-400 mt-1">After {futureRate}% tax on withdrawal</p>
              {rothResult.better === "Traditional" && <p className="text-sm text-green font-semibold mt-2">Better by {fmt(rothResult.difference)}</p>}
            </div>
            <div className={`bg-slate-800/50 border rounded-xl p-5 ${rothResult.better === "Roth" ? "border-green border-l-4" : "border-slate-700/50"}`}>
              <h3 className="font-bold text-white">Roth (Post-Tax)</h3>
              <p className="text-2xl font-bold mt-1">{fmt(rothResult.roth_future)}</p>
              <p className="text-xs text-slate-400 mt-1">Tax-free withdrawal</p>
              {rothResult.better === "Roth" && <p className="text-sm text-green font-semibold mt-2">Better by {fmt(rothResult.difference)}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
