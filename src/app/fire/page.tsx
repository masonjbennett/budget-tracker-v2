"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import StatusCard from "@/components/StatusCard";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function FirePage() {
  const [inputs, setInputs] = useState({
    current_age: 24,
    retire_age: 45,
    end_age: 95,
    portfolio: 25000,
    annual_savings: 30000,
    annual_expenses: 50000,
    stock_pct: 80,
    inflation: 3.0,
    n_sims: 1000,
  });
  const [result, setResult] = useState<any>(null);
  const [ssResult, setSsResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fireNumber = inputs.annual_expenses / 0.04;
  const savingsRate = inputs.annual_savings / (inputs.annual_savings + inputs.annual_expenses) * 100;

  const runSimulation = async () => {
    setLoading(true);
    try {
      const [mc, ss] = await Promise.all([
        api<any>("/api/monte-carlo", inputs),
        api<any>("/api/social-security", { annual_salary: inputs.annual_savings + inputs.annual_expenses, claiming_age: 67 }),
      ]);
      setResult(mc);
      setSsResult(ss);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const update = (field: string, value: any) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">FIRE Calculator</h1>
      <p className="text-slate-400 mt-1 mb-6">
        Financial Independence, Retire Early — calculate when your portfolio can sustain your lifestyle.
        Based on the 4% safe withdrawal rate from the Trinity Study, with inflation-adjusted FIRE targets.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Annual Take-Home ($)</label>
            <input type="number" value={inputs.annual_savings + inputs.annual_expenses}
              onChange={(e) => update("annual_savings", +e.target.value - inputs.annual_expenses)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Annual Expenses ($)</label>
            <input type="number" value={inputs.annual_expenses} onChange={(e) => update("annual_expenses", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Current Portfolio ($)</label>
            <input type="number" value={inputs.portfolio} onChange={(e) => update("portfolio", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Current Age</label>
            <input type="number" value={inputs.current_age} min={18} max={80}
              onChange={(e) => update("current_age", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Stock Allocation (%)</label>
            <input type="range" min={0} max={100} step={5} value={inputs.stock_pct}
              onChange={(e) => update("stock_pct", +e.target.value)} className="w-full accent-accent" />
            <p className="text-sm text-slate-400">{inputs.stock_pct}% stocks / {100 - inputs.stock_pct}% bonds</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Retirement Age</label>
            <input type="number" value={inputs.retire_age} min={25} max={80}
              onChange={(e) => update("retire_age", +e.target.value)}
              className="w-full border border-slate-700/50 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
        </div>
      </div>

      {/* Static metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatusCard label="Savings Rate" value={`${savingsRate.toFixed(0)}%`}
          status={savingsRate >= 50 ? "Excellent" : savingsRate >= 25 ? "Good" : "Low"}
          color={savingsRate >= 50 ? "green" : savingsRate >= 25 ? "yellow" : "red"} />
        <MetricCard label="FIRE Number (4% SWR)" value={fmt(fireNumber)} />
        <MetricCard label="Annual Savings" value={fmt(inputs.annual_savings)} />
        <MetricCard label="Years to FIRE (est)" value={`~${Math.ceil(Math.log(fireNumber / Math.max(inputs.portfolio, 1)) / Math.log(1.07))}`} />
      </div>

      <button onClick={runSimulation} disabled={loading}
        className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50 mb-8">
        {loading ? "Running 1,000 simulations..." : "Run Monte Carlo Simulation"}
      </button>

      {/* Monte Carlo results */}
      {result && (
        <div>
          <hr className="border-slate-700/50 mb-8" />
          <h2 className="text-xl font-bold text-white mb-4">Monte Carlo Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatusCard label="Success Rate" value={`${result.success_rate.toFixed(0)}%`}
              status={result.success_rate >= 85 ? "Strong" : result.success_rate >= 70 ? "Moderate" : "At Risk"}
              color={result.success_rate >= 85 ? "green" : result.success_rate >= 70 ? "yellow" : "red"}
              description={`Plan survives in ${result.success_count} of ${result.n_sims} scenarios.`} />
            <MetricCard label="Median Ending" value={fmt(result.median_ending)} />
            <MetricCard label="Worst 10%" value={fmt(Math.max(0, result.p10_ending))} />
            <MetricCard label="Best 10%" value={fmt(result.p90_ending)} />
          </div>

          {/* Methodology */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-8">
            <p className="font-semibold text-white mb-1">What This Means</p>
            <p className="text-sm text-slate-400">
              Out of {result.n_sims.toLocaleString()} simulated market scenarios, your portfolio survived in{" "}
              <strong className={result.success_rate >= 85 ? "text-green" : "text-red"}>{result.success_count.toLocaleString()}</strong> ({result.success_rate.toFixed(0)}%).
              Assumes {result.stock_pct}% stocks / {100 - result.stock_pct}% bonds with Cholesky-correlated returns.
              Stock returns: 10% mean, 18% stdev. Bond returns: 5% mean, 6% stdev. Inflation randomized at 3% mean.
            </p>
          </div>
        </div>
      )}

      {/* Social Security */}
      {ssResult && (
        <div>
          <hr className="border-slate-700/50 mb-8" />
          <h2 className="text-xl font-bold text-white mb-1">Social Security Estimation</h2>
          <p className="text-slate-400 text-sm mb-4">Simplified estimate based on 2026 bend points.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Est. Monthly SS" value={fmt(ssResult.monthly)} />
            <MetricCard label="Est. Annual SS" value={fmt(ssResult.annual)} />
            <MetricCard label="Reduces FIRE Number By" value={fmt(ssResult.annual / 0.04)} />
          </div>
        </div>
      )}
    </div>
  );
}
