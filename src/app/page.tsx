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
      <div>
        <div className="skeleton h-8 w-80 mb-2" />
        <div className="skeleton h-1 w-full mb-2" />
        <div className="skeleton h-4 w-96 mb-8" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
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

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <MetricCard label="Monthly Take-Home" value={fmt(monthly)} help="Net pay after taxes and deductions" />
        <MetricCard label="Spent (MTD)" value={fmt(totalSpent)} delta="+$162 vs last mo" deltaColor="red" />
        <MetricCard label="Net Worth" value={fmt(netWorth)} />
        <MetricCard label="Budget Adherence" value="87%" help="Percentage of categories on track" />
      </div>

      <hr className="border-border my-8" />

      {/* Financial health ratios */}
      <h2 className="text-lg font-bold text-primary mb-4">Financial Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger">
        <StatusCard
          label="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          status={savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Good" : "Needs Work"}
          color={savingsRate >= 20 ? "green" : savingsRate >= 10 ? "yellow" : "red"}
          description="20%+ is excellent. 10-20% is solid. Below 10% needs attention."
        />
        <StatusCard
          label="Debt-to-Income"
          value={`${dti.toFixed(1)}%`}
          status="Healthy"
          color="green"
          description="Below 20% is great. 20-36% is manageable. Above 36% limits borrowing."
        />
        <StatusCard
          label="Emergency Fund"
          value={`${efMonths.toFixed(1)} mo`}
          status={efMonths >= 6 ? "Strong" : efMonths >= 3 ? "Building" : "Priority"}
          color={efMonths >= 6 ? "green" : efMonths >= 3 ? "yellow" : "red"}
          description="6+ months of essential expenses is the gold standard."
        />
      </div>

      <hr className="border-border my-8" />

      {/* Tax breakdown */}
      {takeHome && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-primary mb-1">Take-Home Breakdown</h2>
          <p className="text-dim text-[0.85rem] mb-4">Based on your income setup.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
            <MetricCard label="Annual Gross" value={fmt(takeHome.annual_gross)} />
            <MetricCard label="Federal Tax" value={fmt(takeHome.fed_tax)} delta={`${takeHome.marginal_fed.toFixed(0)}% marginal`} />
            <MetricCard label="State Tax" value={fmt(takeHome.state_tax)} />
            <MetricCard label="Annual Take-Home" value={fmt(takeHome.annual_take_home)} delta={`${takeHome.effective_rate.toFixed(1)}% effective`} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
