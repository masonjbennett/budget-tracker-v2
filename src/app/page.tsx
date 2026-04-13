"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import StatusCard from "@/components/StatusCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number, decimals = 0): string {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export default function Dashboard() {
  const [takeHome, setTakeHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<any>("/api/take-home", {
      gross_salary: 95000, state: "New York", filing_status: "Single",
      contribution_401k: 6, health_insurance: 180, hsa: 100,
      bonus_amount: 10000, bonus_type: "Annual (spread monthly)",
      student_loan_interest: 0, charitable: 0,
    })
      .then(setTakeHome)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div><div className="skeleton h-9 w-72 mb-3" /><div className="skeleton h-[2px] w-40 mb-3" /><div className="skeleton h-4 w-[28rem] mb-2" /></div>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-[5.5rem] rounded-xl" />)}</div>
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}</div>
      </div>
    );
  }

  const monthly = takeHome?.monthly_take_home || 0;
  const totalSpent = 2606;
  const netSavings = monthly - totalSpent;
  const savingsRate = monthly > 0 ? (netSavings / monthly) * 100 : 0;
  const netWorth = 24800;
  const dti = 0;
  const efMonths = 9500 / 2702;

  return (
    <div>
      <PageHeader
        title="Financial Health Dashboard"
        description="Your financial overview at a glance — updated as you log expenses and adjust your budget."
      />

      {/* Hero metric row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <MetricCard label="Monthly Take-Home" value={fmt(monthly)} help="Net pay after taxes and deductions" />
        <MetricCard label="Spent This Month" value={fmt(totalSpent)} delta="+$162 vs last mo" deltaColor="red" />
        <MetricCard label="Net Worth" value={fmt(netWorth)} delta="+$1,700 from last snapshot" deltaColor="green" />
        <MetricCard label="Budget Adherence" value="87%" delta="14 of 16 on track" />
      </div>

      {/* Health indicators */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[1.05rem] font-semibold text-white">Financial Health</h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
          <StatusCard
            label="Savings Rate"
            value={`${savingsRate.toFixed(1)}%`}
            status={savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Good" : "Needs Work"}
            color={savingsRate >= 20 ? "green" : savingsRate >= 10 ? "yellow" : "red"}
            description="20%+ is excellent. 10-20% is solid. Below 10% needs attention."
          />
          <StatusCard label="Debt-to-Income" value={`${dti.toFixed(1)}%`} status="Debt-Free" color="green"
            description="Below 20% is great. 20-36% is manageable. Above 36% limits borrowing." />
          <StatusCard
            label="Emergency Fund"
            value={`${efMonths.toFixed(1)} mo`}
            status={efMonths >= 6 ? "Strong" : efMonths >= 3 ? "Building" : "Priority"}
            color={efMonths >= 6 ? "green" : efMonths >= 3 ? "yellow" : "red"}
            description="6+ months of essential expenses is the gold standard."
          />
        </div>
      </div>

      {/* Spending breakdown placeholder */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[1.05rem] font-semibold text-white">Monthly Spending</h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card min-h-[20rem] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 font-medium">Spending by Category</p>
              <p className="text-xs text-slate-600 mt-1">Charts coming with Plotly integration</p>
            </div>
          </div>
          <div className="card min-h-[20rem] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 font-medium">Monthly Trend</p>
              <p className="text-xs text-slate-600 mt-1">Charts coming with Plotly integration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax breakdown */}
      {takeHome && (
        <div className="mt-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[1.05rem] font-semibold text-white">Tax Breakdown</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[0.7rem] text-slate-600 font-medium">Based on income setup</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            <MetricCard label="Annual Gross" value={fmt(takeHome.annual_gross)} />
            <MetricCard label="Federal Tax" value={fmt(takeHome.fed_tax)} delta={`${takeHome.marginal_fed.toFixed(0)}% marginal`} />
            <MetricCard label="State Tax" value={fmt(takeHome.state_tax)} />
            <MetricCard label="Take-Home Pay" value={fmt(takeHome.annual_take_home)} delta={`${takeHome.effective_rate.toFixed(1)}% effective rate`} deltaColor="green" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
