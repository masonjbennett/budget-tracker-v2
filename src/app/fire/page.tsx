"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import StatusCard from "@/components/StatusCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Chart from "@/components/Chart";

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

export default function FirePage() {
  const [inputs, setInputs] = useState({
    current_age: 24, retire_age: 45, end_age: 95,
    portfolio: 25000, annual_savings: 30000, annual_expenses: 50000,
    stock_pct: 80, inflation: 3.0, n_sims: 1000,
  });
  const [result, setResult] = useState<any>(null);
  const [ssResult, setSsResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fireNumber = inputs.annual_expenses / 0.04;
  const savingsRate = (inputs.annual_savings / (inputs.annual_savings + inputs.annual_expenses)) * 100;
  const totalIncome = inputs.annual_savings + inputs.annual_expenses;

  const runSimulation = async () => {
    setLoading(true);
    try {
      const [mc, ss] = await Promise.all([
        api<any>("/api/monte-carlo", inputs),
        api<any>("/api/social-security", { annual_salary: totalIncome, claiming_age: 67 }),
      ]);
      setResult(mc);
      setSsResult(ss);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const u = (field: string, value: any) => setInputs((p) => ({ ...p, [field]: value }));

  return (
    <div>
      <PageHeader
        title="FIRE Calculator"
        description="Financial Independence, Retire Early — calculate when your portfolio can sustain your lifestyle. Based on the Trinity Study's 4% safe withdrawal rate with inflation-adjusted targets."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Your Situation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Annual Take-Home ($)">
                <input type="number" value={totalIncome} onChange={(e) => u("annual_savings", +e.target.value - inputs.annual_expenses)} />
              </InputField>
              <InputField label="Annual Expenses ($)">
                <input type="number" value={inputs.annual_expenses} onChange={(e) => u("annual_expenses", +e.target.value)} />
              </InputField>
              <InputField label="Current Portfolio ($)">
                <input type="number" value={inputs.portfolio} onChange={(e) => u("portfolio", +e.target.value)} />
              </InputField>
              <InputField label="Current Age">
                <input type="number" value={inputs.current_age} min={18} max={80} onChange={(e) => u("current_age", +e.target.value)} />
              </InputField>
            </div>
          </div>

          <div className="card">
            <h3 className="text-[0.85rem] font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
              Simulation Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label={`Stock Allocation — ${inputs.stock_pct}%`} help={`${100 - inputs.stock_pct}% bonds`}>
                <input type="range" min={0} max={100} step={5} value={inputs.stock_pct} onChange={(e) => u("stock_pct", +e.target.value)} />
              </InputField>
              <InputField label="Retirement Age">
                <input type="number" value={inputs.retire_age} min={25} max={80} onChange={(e) => u("retire_age", +e.target.value)} />
              </InputField>
              <InputField label="Plan Through Age">
                <input type="number" value={inputs.end_age} min={70} max={100} onChange={(e) => u("end_age", +e.target.value)} />
              </InputField>
              <InputField label="Simulations">
                <select value={inputs.n_sims} onChange={(e) => u("n_sims", +e.target.value)}>
                  {[500, 1000, 2000, 5000].map((n) => <option key={n} value={n}>{n.toLocaleString()}</option>)}
                </select>
              </InputField>
            </div>
          </div>
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-4 stagger">
          <StatusCard
            label="Savings Rate"
            value={`${savingsRate.toFixed(0)}%`}
            status={savingsRate >= 50 ? "Excellent" : savingsRate >= 25 ? "Good" : "Low"}
            color={savingsRate >= 50 ? "green" : savingsRate >= 25 ? "yellow" : "red"}
            description="50%+ = FIRE in ~17 years. 25% = ~32 years."
          />
          <div className="card bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/20">
            <p className="text-[0.68rem] uppercase tracking-[0.08em] text-blue-400 font-semibold">FIRE Number</p>
            <p className="text-[2rem] font-bold text-white mt-1 leading-tight font-num">{fmt(fireNumber)}</p>
            <p className="text-[0.75rem] text-slate-400 mt-1">At 4% safe withdrawal rate</p>
          </div>
          <MetricCard label="Annual Savings" value={fmt(inputs.annual_savings)} />
        </div>
      </div>

      <button onClick={runSimulation} disabled={loading}
        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 mb-10 text-[0.9rem]">
        {loading ? (
          <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Running {inputs.n_sims.toLocaleString()} simulations...</>
        ) : (
          <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Run Monte Carlo Simulation</>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[1.1rem] font-semibold text-white">Simulation Results</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="badge badge-blue">{result.n_sims.toLocaleString()} scenarios</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
            <StatusCard
              label="Success Rate"
              value={`${result.success_rate.toFixed(0)}%`}
              status={result.success_rate >= 85 ? "Strong" : result.success_rate >= 70 ? "Moderate" : "At Risk"}
              color={result.success_rate >= 85 ? "green" : result.success_rate >= 70 ? "yellow" : "red"}
              description={`Portfolio survives in ${result.success_count.toLocaleString()} of ${result.n_sims.toLocaleString()} scenarios.`}
            />
            <MetricCard label="Median Ending" value={fmt(result.median_ending)} />
            <MetricCard label="Worst 10%" value={fmt(Math.max(0, result.p10_ending))} delta="10th percentile" />
            <MetricCard label="Best 10%" value={fmt(result.p90_ending)} delta="90th percentile" deltaColor="green" />
          </div>

          {/* Fan chart */}
          <Chart
            data={[
              // 10th-90th band
              { x: result.ages, y: result.percentiles.p90, mode: "lines", line: { width: 0 }, showlegend: false, hoverinfo: "skip" },
              { x: result.ages, y: result.percentiles.p10, mode: "lines", line: { width: 0 }, fill: "tonexty", fillcolor: "rgba(59,130,246,0.08)", name: "10th-90th", hoverinfo: "skip" },
              // 25th-75th band
              { x: result.ages, y: result.percentiles.p75, mode: "lines", line: { width: 0 }, showlegend: false, hoverinfo: "skip" },
              { x: result.ages, y: result.percentiles.p25, mode: "lines", line: { width: 0 }, fill: "tonexty", fillcolor: "rgba(59,130,246,0.18)", name: "25th-75th", hoverinfo: "skip" },
              // Median
              { x: result.ages, y: result.percentiles.p50, mode: "lines", line: { color: "#3b82f6", width: 2.5 }, name: "Median", hovertemplate: "Age %{x}: $%{y:,.0f}<extra></extra>" },
              // 5th percentile
              { x: result.ages, y: result.percentiles.p5, mode: "lines", line: { color: "#ef4444", width: 1.5, dash: "dot" }, name: "5th pctl", hovertemplate: "Age %{x}: $%{y:,.0f}<extra></extra>" },
            ]}
            layout={{
              xaxis: { title: { text: "Age", font: { size: 12, color: "#64748b" } } },
              yaxis: { title: { text: "Portfolio Value", font: { size: 12, color: "#64748b" } }, tickprefix: "$", tickformat: ",.0s" },
              shapes: [
                { type: "line", x0: result.retire_age, x1: result.retire_age, y0: 0, y1: 1, yref: "paper", line: { color: "#eab308", width: 1.5, dash: "dash" } },
                { type: "line", x0: result.ages[0], x1: result.ages[result.ages.length - 1], y0: 0, y1: 0, line: { color: "#ef4444", width: 1, dash: "dash" } },
              ],
              annotations: [
                { x: result.retire_age, y: 1, yref: "paper", text: "Retirement", showarrow: false, font: { size: 11, color: "#eab308" }, yanchor: "bottom" },
              ],
            }}
            height={400}
            className="mb-8"
          />

          {/* Methodology */}
          <div className="card bg-white/[0.02] border-white/[0.04]">
            <h3 className="text-[0.82rem] font-semibold text-white mb-2">Methodology</h3>
            <p className="text-[0.78rem] text-slate-500 leading-relaxed">
              {result.n_sims.toLocaleString()} simulations with Cholesky-correlated stock/bond returns.
              Stocks: 10% mean, 18% stdev (S&P 500 historical). Bonds: 5% mean, 6% stdev.
              {result.stock_pct}% stocks / {100 - result.stock_pct}% bonds. Inflation randomized at 3% mean.
              Two-phase model: accumulation (contributing) then distribution (withdrawing).
              Source: Trinity Study (1998), Shiller/Ibbotson historical data.
            </p>
          </div>
        </div>
      )}

      {/* Social Security */}
      {ssResult && (
        <div className="mt-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[1.05rem] font-semibold text-white">Social Security Estimate</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <p className="text-[0.82rem] text-slate-500 mb-4">Simplified estimate based on 2026 bend points. Actual benefits depend on your full 35-year earnings history.</p>
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="Monthly Benefit" value={fmt(ssResult.monthly)} delta="At age 67 (FRA)" />
            <MetricCard label="Annual Income" value={fmt(ssResult.annual)} />
            <MetricCard label="Reduces FIRE # By" value={fmt(ssResult.annual / 0.04)} delta="Less needed from portfolio" deltaColor="green" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
