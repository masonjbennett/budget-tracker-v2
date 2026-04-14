"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function GoalsPage() {
  const { data, setGoals } = useFinance();
  const goals = data.savings_goals;
  const [newGoal, setNewGoal] = useState({ name: "", target: 10000, current: 0, deadline: "2027-12-31", priority: 1 });

  const addGoal = () => {
    if (newGoal.name && newGoal.target > 0) {
      setGoals([...goals, { ...newGoal }]);
      setNewGoal({ name: "", target: 10000, current: 0, deadline: "2027-12-31", priority: 1 });
    }
  };

  return (
    <div>
      <PageHeader title="Savings Goals" description="Track progress — changes auto-save to your account." />

      <div className="space-y-4 mb-8 stagger">
        {[...goals].sort((a, b) => a.priority - b.priority).map((goal, i) => {
          const pct = goal.target > 0 ? (goal.current / goal.target * 100) : 0;
          const remaining = goal.target - goal.current;
          const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000));
          const monthsLeft = Math.max(1, daysLeft / 30.44);
          const monthlyNeeded = remaining > 0 ? remaining / monthsLeft : 0;
          const color = pct >= 75 ? "green" : pct >= 40 ? "yellow" : "accent";

          return (
            <div key={i} className="card">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[1rem] font-bold text-white">{goal.name}</span>
                  <span className="badge badge-blue">#{goal.priority}</span>
                </div>
                <span className={`text-[1.2rem] font-bold font-num text-${color}`}>{pct.toFixed(0)}%</span>
              </div>
              <div className="progress-track h-2.5 mb-3">
                <div className={`progress-fill bg-${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="flex justify-between text-[0.82rem]">
                <span className="text-slate-400 font-num">{fmt(goal.current)} / {fmt(goal.target)}</span>
                <span className="text-slate-500">{fmt(monthlyNeeded)}/mo · {daysLeft}d left</span>
              </div>
              <div className="mt-3 flex items-center gap-3 pt-3 border-t border-white/[0.04]">
                <input type="number" value={goal.current} onChange={e => {
                  const updated = [...goals]; updated[i] = { ...goal, current: +e.target.value }; setGoals(updated);
                }} className="w-32 text-[0.82rem]" />
                <button onClick={() => setGoals(goals.filter((_, j) => j !== i))} className="text-[0.72rem] text-slate-600 hover:text-red transition-colors">Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="text-[0.85rem] font-semibold text-white mb-3">Add Goal</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <input placeholder="Goal name" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
          <input type="number" placeholder="Target ($)" value={newGoal.target || ""} onChange={e => setNewGoal({...newGoal, target: +e.target.value})} />
          <input type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} />
          <button onClick={addGoal} className="btn-primary py-2.5">Add Goal</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
