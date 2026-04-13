"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function InvestmentsPage() {
  const [inputs, setInputs] = useState({
    starting_amount: 5000, monthly_contribution: 500,
    annual_return: 7.0, time_horizon: 30, contribution_growth: 3.0,
  });
  const [results, setResults] = useState<any>(null);

  const calculate = async () => {
    const [conservative, moderate, aggressive] = await Promise.all([
      api<any>("/api/investment-project", { ...inputs, annual_return: 5.0 }),
      api<any>("/api/investment-project", { ...inputs, annual_return: 7.0 }),
      api<any>("/api/investment-project", { ...inputs, annual_return: 10.0 }),
    ]);
    setResults({ conservative, moderate, aggressive });
  };

  const update = (field: string, value: any) => setInputs({ ...inputs, [field]: value });

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">Investment Growth Projector</h1>
      <p className="text-dim mt-1 mb-6">Model compound growth across scenarios and see the true cost of waiting.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-dim mb-1">Starting Amount ($)</label>
          <input type="number" value={inputs.starting_amount} onChange={(e) => update("starting_amount", +e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dim mb-1">Monthly Contribution ($)</label>
          <input type="number" value={inputs.monthly_contribution} onChange={(e) => update("monthly_contribution", +e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dim mb-1">Time Horizon (years)</label>
          <input type="range" min={1} max={50} value={inputs.time_horizon}
            onChange={(e) => update("time_horizon", +e.target.value)} className="w-full accent-accent" />
          <p className="text-sm text-dim">{inputs.time_horizon} years</p>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-dim mb-1">Income Growth (%/yr)</label>
        <input type="number" value={inputs.contribution_growth} step={0.5} min={0} max={20}
          onChange={(e) => update("contribution_growth", +e.target.value)}
          className="w-32 border border-border rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
        <p className="text-xs text-dim mt-1">Contributions grow with your salary. 3-5% typical.</p>
      </div>

      <button onClick={calculate}
        className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-lg transition-all mb-8">
        Project Growth
      </button>

      {results && (
        <>
          <hr className="border-border mb-8" />
          <h2 className="text-xl font-bold text-primary mb-4">Scenario Comparison</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Conservative (5%)", data: results.conservative, color: "border-l-accent" },
              { label: "Moderate (7%)", data: results.moderate, color: "border-l-green" },
              { label: "Aggressive (10%)", data: results.aggressive, color: "border-l-yellow" },
            ].map(({ label, data, color }) => {
              const final = data.values[data.values.length - 1];
              const contributed = data.contributions[data.contributions.length - 1];
              const growth = final - contributed;
              return (
                <div key={label} className={`bg-white border ${color} border-l-4 border-border rounded-xl p-5`}>
                  <p className="font-semibold text-primary">{label}</p>
                  <p className="text-2xl font-bold mt-1">{fmt(final)}</p>
                  <p className="text-sm text-dim mt-1">Contributed: {fmt(contributed)}</p>
                  <p className="text-sm text-green">Growth: {fmt(growth)}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
