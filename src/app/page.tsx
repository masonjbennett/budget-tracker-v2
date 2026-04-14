"use client";

import { useFinance } from "@/context/FinanceContext";
import MetricCard from "@/components/MetricCard";
import StatusCard from "@/components/StatusCard";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Chart from "@/components/Chart";

function fmt(val: number, decimals = 0): string {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export default function Dashboard() {
  const { data, takeHome, loading } = useFinance();

  if (loading || !takeHome) {
    return (
      <div className="space-y-6">
        <div><div className="skeleton h-9 w-72 mb-3" /><div className="skeleton h-[2px] w-40 mb-3" /><div className="skeleton h-4 w-[28rem]" /></div>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-[5.5rem] rounded-xl" />)}</div>
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}</div>
      </div>
    );
  }

  const monthly = takeHome.monthly_take_home;
  const curMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = data.expenses.filter(e => e.date.startsWith(curMonth));
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const netSavings = monthly - totalSpent;
  const savingsRate = monthly > 0 ? (netSavings / monthly) * 100 : 0;

  const totalAssets = Object.values(data.assets).reduce((s, v) => s + v, 0);
  const totalLiabilities = Object.values(data.liabilities).reduce((s, v) => s + v, 0);
  const netWorth = totalAssets - totalLiabilities;

  const budgetTotal = Object.values(data.budget).reduce((sum, cat) => sum + Object.values(cat).reduce((s, v) => s + v, 0), 0);
  const budgetCats = { ...data.budget.needs, ...data.budget.wants, ...data.budget.savings };
  const catSpending: Record<string, number> = {};
  monthExpenses.forEach(e => { catSpending[e.category] = (catSpending[e.category] || 0) + e.amount; });
  const onTrack = Object.entries(budgetCats).filter(([cat, b]) => b === 0 || (catSpending[cat] || 0) <= b).length;
  const adherence = Object.keys(budgetCats).length > 0 ? Math.round(onTrack / Object.keys(budgetCats).length * 100) : 100;

  const monthlyNeeds = Object.values(data.budget.needs).reduce((s, v) => s + v, 0);
  const dti = monthly > 0 ? (data.budget.needs["Min. Debt Payments"] || 0) / monthly * 100 : 0;
  const efMonths = monthlyNeeds > 0 ? (data.assets["Savings"] || 0) / monthlyNeeds : 0;

  // Category chart data
  const catLabels = Object.keys(catSpending);
  const catValues = Object.values(catSpending);
  const catColors = ["#3b82f6", "#22c55e", "#6366f1", "#eab308", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316", "#14b8a6", "#a855f7", "#ef4444", "#84cc16"];

  return (
    <div>
      <PageHeader title="Financial Health Dashboard" description="Your financial overview at a glance — updated live as you adjust your income and log expenses." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <MetricCard label="Monthly Take-Home" value={fmt(monthly)} help="Net pay after taxes and deductions" />
        <MetricCard label="Spent This Month" value={fmt(totalSpent)} delta={`${monthExpenses.length} transactions`} />
        <MetricCard label="Net Worth" value={fmt(netWorth)} />
        <MetricCard label="Budget Adherence" value={`${adherence}%`} delta={`${onTrack} of ${Object.keys(budgetCats).length} on track`} />
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[1.05rem] font-semibold text-white">Financial Health</h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
          <StatusCard label="Savings Rate" value={`${savingsRate.toFixed(1)}%`}
            status={savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Good" : "Needs Work"}
            color={savingsRate >= 20 ? "green" : savingsRate >= 10 ? "yellow" : "red"}
            description="20%+ is excellent. 10-20% is solid. Below 10% needs attention." />
          <StatusCard label="Debt-to-Income" value={`${dti.toFixed(1)}%`}
            status={dti === 0 ? "Debt-Free" : dti <= 20 ? "Healthy" : "Watch"}
            color={dti <= 20 ? "green" : dti <= 36 ? "yellow" : "red"}
            description="Below 20% is great. 20-36% is manageable. Above 36% limits borrowing." />
          <StatusCard label="Emergency Fund" value={`${efMonths.toFixed(1)} mo`}
            status={efMonths >= 6 ? "Strong" : efMonths >= 3 ? "Building" : "Priority"}
            color={efMonths >= 6 ? "green" : efMonths >= 3 ? "yellow" : "red"}
            description="6+ months of essential expenses is the gold standard." />
        </div>
      </div>

      {/* Charts */}
      {catLabels.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[1.05rem] font-semibold text-white">Monthly Spending</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Chart
              data={[{
                labels: catLabels, values: catValues,
                type: "pie", hole: 0.5,
                marker: { colors: catColors.slice(0, catLabels.length), line: { color: "#0f172a", width: 2 } },
                textinfo: "percent", textposition: "inside",
                textfont: { size: 11, color: "#f8fafc" },
                hovertemplate: "<b>%{label}</b><br>$%{value:,.2f}<br>%{percent}<extra></extra>",
              }]}
              layout={{ showlegend: true }}
              height={380}
            />
            <Chart
              data={[{
                x: ["Income", "Spent", "Savings"],
                y: [monthly, totalSpent, netSavings],
                type: "bar",
                marker: { color: ["#3b82f6", "#ef4444", netSavings >= 0 ? "#22c55e" : "#ef4444"] },
                text: [fmt(monthly), fmt(totalSpent), fmt(netSavings)],
                textposition: "outside", textfont: { size: 12, color: "#94a3b8" },
              }]}
              layout={{ yaxis: { tickprefix: "$", tickformat: ",.0f" }, showlegend: false }}
              height={380}
            />
          </div>
        </div>
      )}

      {/* Tax breakdown */}
      <div className="mt-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[1.05rem] font-semibold text-white">Tax Breakdown</h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[0.7rem] text-slate-600 font-medium">Updates with Income page</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          <MetricCard label="Annual Gross" value={fmt(takeHome.annual_gross)} />
          <MetricCard label="Federal Tax" value={fmt(takeHome.fed_tax)} delta={`${takeHome.marginal_fed.toFixed(0)}% marginal`} />
          <MetricCard label="State Tax" value={fmt(takeHome.state_tax)} />
          <MetricCard label="Take-Home Pay" value={fmt(takeHome.annual_take_home)} delta={`${takeHome.effective_rate.toFixed(1)}% effective rate`} deltaColor="green" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
