"use client";

import { useFinance } from "@/context/FinanceContext";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];

function InputField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.78rem] font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
      {help && <p className="text-[0.68rem] text-slate-600 mt-1">{help}</p>}
    </div>
  );
}

export default function IncomePage() {
  const { data, takeHome, updateIncome } = useFinance();
  const income = data.income;
  const u = (field: string, value: any) => updateIncome({ [field]: value });

  return (
    <div>
      <PageHeader title="Income Setup" description="Adjust any field — your take-home pay updates instantly across all pages." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              Salary & Location
            </h3>
            <div className="space-y-4">
              <InputField label="Annual Gross Salary">
                <input type="number" value={income.gross_salary} onChange={(e) => u("gross_salary", +e.target.value)} />
              </InputField>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="State">
                  <select value={income.state} onChange={(e) => u("state", e.target.value)}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </InputField>
                <InputField label="Filing Status">
                  <select value={income.filing_status} onChange={(e) => u("filing_status", e.target.value)}>
                    {["Single","Married Filing Jointly","Married Filing Separately","Head of Household"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </InputField>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              Pre-Tax Deductions
            </h3>
            <div className="space-y-4">
              <InputField label={`401(k) Contribution — ${income.contribution_401k}%`} help={`${fmt(income.gross_salary * income.contribution_401k / 100)}/year · 2026 limit: $24,500`}>
                <input type="range" min={0} max={50} value={income.contribution_401k} onChange={(e) => u("contribution_401k", +e.target.value)} />
              </InputField>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Health Insurance ($/mo)">
                  <input type="number" value={income.health_insurance} onChange={(e) => u("health_insurance", +e.target.value)} />
                </InputField>
                <InputField label="HSA ($/mo)" help="2026 limit: $4,400/yr">
                  <input type="number" value={income.hsa} onChange={(e) => u("hsa", +e.target.value)} />
                </InputField>
              </div>
              <InputField label="Student Loan Interest ($/yr)" help="Max $2,500 above-the-line">
                <input type="number" value={income.student_loan_interest} max={2500} onChange={(e) => u("student_loan_interest", Math.min(2500, +e.target.value))} />
              </InputField>
            </div>
          </div>

          <div className="card">
            <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Bonus
            </h3>
            <div className="space-y-4">
              <InputField label="Bonus Type">
                <select value={income.bonus_type} onChange={(e) => u("bonus_type", e.target.value)}>
                  {["None","Annual (spread monthly)","Signing (lump sum)"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>
              {income.bonus_type !== "None" && (
                <InputField label="Bonus Amount">
                  <input type="number" value={income.bonus_amount} onChange={(e) => u("bonus_amount", +e.target.value)} />
                </InputField>
              )}
            </div>
          </div>
        </div>

        {/* Results — updates live */}
        <div>
          {takeHome ? (
            <div className="space-y-4 stagger sticky top-8">
              <div className="card bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/20">
                <p className="text-[0.68rem] uppercase tracking-[0.08em] text-blue-400 font-semibold">Monthly Take-Home</p>
                <p className="text-[2.5rem] font-bold text-white mt-1 leading-tight font-num">{fmt(takeHome.monthly_take_home)}</p>
                <p className="text-[0.82rem] text-slate-400 mt-1">{fmt(takeHome.annual_take_home)} / year</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Federal Tax" value={fmt(takeHome.fed_tax)} delta={`${takeHome.marginal_fed.toFixed(0)}% marginal`} />
                <MetricCard label="State Tax" value={fmt(takeHome.state_tax)} />
                <MetricCard label="FICA" value={fmt(takeHome.fica)} />
                <MetricCard label="Pre-Tax" value={fmt(takeHome.pretax)} />
              </div>
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.78rem] text-slate-400">Effective Tax Rate</span>
                  <span className="text-[1.1rem] font-bold text-yellow font-num">{takeHome.effective_rate.toFixed(1)}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill bg-yellow" style={{ width: `${takeHome.effective_rate}%` }} />
                </div>
                <p className="text-[0.68rem] text-slate-600 mt-2">You keep {(100 - takeHome.effective_rate).toFixed(1)}% of gross income.</p>
              </div>
              <div className="card">
                <h3 className="text-[0.78rem] font-semibold text-white mb-2">Deduction Summary</h3>
                <div className="space-y-1.5 text-[0.82rem]">
                  <div className="flex justify-between"><span className="text-slate-400">AGI</span><span className="font-num text-slate-300">{fmt(takeHome.agi)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Standard Deduction</span><span className="font-num text-slate-300">-{fmt(takeHome.std_ded)}</span></div>
                  <div className="flex justify-between border-t border-white/[0.06] pt-1.5 mt-1.5"><span className="text-slate-300 font-medium">Taxable Income</span><span className="font-num text-white font-semibold">{fmt(takeHome.taxable)}</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="skeleton h-96 rounded-xl sticky top-8" />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
