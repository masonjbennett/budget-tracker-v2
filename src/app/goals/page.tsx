"use client";

import { useState } from "react";

function fmt(val: number): string {
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { name: "Emergency Fund", target: 15000, current: 9500, deadline: "2027-12-31", priority: 1 },
    { name: "Vacation Fund", target: 3000, current: 800, deadline: "2026-12-31", priority: 2 },
    { name: "Down Payment", target: 50000, current: 1800, deadline: "2030-06-30", priority: 3 },
  ]);
  const [newGoal, setNewGoal] = useState({ name: "", target: 10000, current: 0, deadline: "2027-12-31", priority: 1 });

  const addGoal = () => {
    if (newGoal.name && newGoal.target > 0) {
      setGoals([...goals, { ...newGoal }]);
      setNewGoal({ name: "", target: 10000, current: 0, deadline: "2027-12-31", priority: 1 });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">Savings Goals</h1>
      <p className="text-dim mt-1 mb-6">Set targets, track progress, and see how much to save each month.</p>

      {/* Goal cards */}
      <div className="space-y-4 mb-8">
        {goals.sort((a, b) => a.priority - b.priority).map((goal, i) => {
          const pct = goal.target > 0 ? (goal.current / goal.target * 100) : 0;
          const remaining = goal.target - goal.current;
          const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000));
          const monthsLeft = Math.max(1, daysLeft / 30.44);
          const monthlyNeeded = remaining > 0 ? remaining / monthsLeft : 0;
          const color = pct >= 100 ? "green" : pct >= 75 ? "green" : pct >= 40 ? "yellow" : "accent";

          return (
            <div key={i} className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-bold text-primary text-lg">{goal.name}</span>
                  <span className="text-dim text-xs ml-2">Priority #{goal.priority}</span>
                </div>
                <span className={`text-xl font-bold text-${color}`}>{pct.toFixed(0)}%</span>
              </div>
              <div className="bg-surface rounded-full h-3 mb-2">
                <div className={`bg-${color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="flex justify-between text-sm text-dim">
                <span>{fmt(goal.current)} / {fmt(goal.target)}</span>
                <span>{fmt(monthlyNeeded)}/mo needed · {daysLeft} days left</span>
              </div>
              <div className="mt-3 flex gap-2">
                <input type="number" value={goal.current} onChange={(e) => {
                  const updated = [...goals];
                  updated[i] = { ...goal, current: +e.target.value };
                  setGoals(updated);
                }} className="w-32 border border-border rounded-lg px-3 py-1.5 text-sm focus:border-accent outline-none" />
                <button onClick={() => setGoals(goals.filter((_, j) => j !== i))}
                  className="text-red text-xs hover:underline">Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add goal */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-bold text-primary mb-3">Add Goal</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input placeholder="Goal name" value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
          <input type="number" placeholder="Target ($)" value={newGoal.target || ""} onChange={(e) => setNewGoal({ ...newGoal, target: +e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
          <input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none" />
          <button onClick={addGoal} className="bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">Add Goal</button>
        </div>
      </div>
    </div>
  );
}
