"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function InputField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.78rem] font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
      {help && <p className="text-[0.68rem] text-slate-600 mt-1">{help}</p>}
    </div>
  );
}

const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];

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
        annual_return: 7.0, years: 30,
      });
      setRothResult(roth);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Tax Estimator"
        description="Estimate your federal and state tax liability, compare deduction strategies, and optimize contributions."
        source={{ label: "IRS Rev. Proc. 2025-32", href: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" }}
      />

      {/* Quick inputs */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField label="Gross Salary ($)">
            <input type="number" value={income.gross_salary} onChange={(e) => setIncome({...income, gross_salary: +e.target.value})} />
          </InputField>
          <InputField label="State">
            <select value={income.state} onChange={(e) => setIncome({...income, state: e.target.value})}>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </InputField>
          <InputField label="Filing Status">
            <select value={income.filing_status} onChange={(e) => setIncome({...income, filing_status: e.target.value})}>
              {["Single","Married Filing Jointly","Married Filing Separately","Head of Household"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </InputField>
          <div className="flex items-end">
            <button onClick={calculate} disabled={loading} className="btn-primary w-full py-[0.625rem] disabled:opacity-50">
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in">
          {/* Tax metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
            <MetricCard label="Federal Tax" value={fmt(result.fed_tax)} />
            <MetricCard label="State Tax" value={fmt(result.state_tax)} />
            <MetricCard label="FICA" value={fmt(result.fica)} />
            <MetricCard label="Total Tax" value={fmt(result.total_tax)} delta={`${result.effective_rate.toFixed(1)}% effective`} deltaColor="red" />
          </div>

          {/* Rates + Deductions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="card">
              <h3 className="text-[0.85rem] font-semibold text-white mb-4">Tax Rates</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-500 font-medium">Effective Rate</p>
                  <p className="text-[2rem] font-bold text-yellow font-num mt-1">{result.effective_rate.toFixed(1)}%</p>
                  <p className="text-[0.72rem] text-slate-600 mt-1">What you actually pay overall</p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-500 font-medium">Marginal Rate</p>
                  <p className="text-[2rem] font-bold text-red font-num mt-1">{result.marginal_fed.toFixed(0)}%</p>
                  <p className="text-[0.72rem] text-slate-600 mt-1">Tax on your next dollar</p>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-[0.85rem] font-semibold text-white mb-4">Deduction Breakdown</h3>
              <div className="space-y-2 text-[0.82rem]">
                <div className="flex justify-between"><span className="text-slate-400">Filing Status</span><span className="text-slate-300 font-medium">{result.filing}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">AGI</span><span className="font-num text-slate-300">{fmt(result.agi)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Standard Deduction</span><span className="font-num text-slate-300">-{fmt(result.std_ded)}</span></div>
                <div className="flex justify-between border-t border-white/[0.06] pt-2 mt-2">
                  <span className="text-white font-medium">Taxable Income</span>
                  <span className="font-num text-white font-semibold">{fmt(result.taxable)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Roth vs Traditional */}
          {rothResult && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[1.05rem] font-semibold text-white">Roth vs. Traditional 401(k)</h2>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <p className="text-[0.82rem] text-slate-500 mb-4">Compare after-tax ending values based on current vs expected retirement rate.</p>

              <div className="mb-4">
                <InputField label="Expected Retirement Tax Rate (%)">
                  <input type="number" value={futureRate} min={0} max={50} onChange={(e) => setFutureRate(+e.target.value)} className="w-32" />
                </InputField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`card ${rothResult.better === "Traditional" ? "border-green/30 bg-green/[0.03]" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[0.85rem] font-semibold text-white">Traditional</h3>
                    {rothResult.better === "Traditional" && <span className="badge badge-green">Recommended</span>}
                  </div>
                  <p className="text-[1.8rem] font-bold text-white font-num">{fmt(rothResult.traditional_after_tax)}</p>
                  <p className="text-[0.75rem] text-slate-500 mt-1">After {futureRate}% tax on withdrawal</p>
                  {rothResult.better === "Traditional" && <p className="text-[0.82rem] text-green font-semibold mt-2">Saves {fmt(rothResult.difference)}</p>}
                </div>
                <div className={`card ${rothResult.better === "Roth" ? "border-green/30 bg-green/[0.03]" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[0.85rem] font-semibold text-white">Roth</h3>
                    {rothResult.better === "Roth" && <span className="badge badge-green">Recommended</span>}
                  </div>
                  <p className="text-[1.8rem] font-bold text-white font-num">{fmt(rothResult.roth_future)}</p>
                  <p className="text-[0.75rem] text-slate-500 mt-1">Tax-free withdrawal</p>
                  {rothResult.better === "Roth" && <p className="text-[0.82rem] text-green font-semibold mt-2">Saves {fmt(rothResult.difference)}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="card min-h-[20rem] flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">Tax breakdown & Roth analysis</p>
            <p className="text-xs text-slate-600 mt-1">Enter your income details above and click Calculate.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
