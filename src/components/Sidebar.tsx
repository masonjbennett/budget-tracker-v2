"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [{ icon: "📊", name: "Dashboard", href: "/" }],
  },
  {
    label: "MANAGE",
    items: [
      { icon: "💰", name: "Income Setup", href: "/income" },
      { icon: "📋", name: "Budget Builder", href: "/budget" },
      { icon: "💳", name: "Expense Tracker", href: "/expenses" },
    ],
  },
  {
    label: "GROW",
    items: [
      { icon: "📈", name: "Net Worth", href: "/net-worth" },
      { icon: "🎯", name: "Savings Goals", href: "/goals" },
      { icon: "🏦", name: "Debt Payoff", href: "/debt" },
    ],
  },
  {
    label: "PLAN",
    items: [
      { icon: "📈", name: "Investments", href: "/investments" },
      { icon: "🔥", name: "FIRE Calculator", href: "/fire" },
      { icon: "🧾", name: "Tax Estimator", href: "/tax" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#1B2A4A] to-[#243B63] text-white flex flex-col z-50">
      {/* Header */}
      <div className="text-center py-6 px-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-[#7DD3FC] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Budget Tracker
        </h1>
        <p className="text-sm text-white/70 italic mt-1">Track your money. Plan your future.</p>
        <p className="text-xs text-[#94A3C0] mt-0.5">
          by{" "}
          <a href="https://masonjbennett.com" target="_blank" className="text-[#CBD5E1] hover:text-white transition-colors">
            Mason Bennett
          </a>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[#94A3C0] font-semibold mt-4 mb-1.5 ml-1 pt-3 border-t border-white/8 first:border-t-0 first:pt-0 first:mt-2">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all duration-200 ${
                    active
                      ? "bg-[#2E86AB]/30 border border-[#2E86AB]/50 text-[#7DD3FC] font-semibold"
                      : "text-[#CBD5E1] hover:bg-white/8 hover:text-white border border-transparent"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <button className="w-full py-2 px-4 bg-[#2E86AB]/30 border border-[#2E86AB]/50 rounded-lg text-sm text-[#7DD3FC] font-medium hover:bg-[#2E86AB]/50 transition-colors">
          💾 Save
        </button>
        <p className="text-center text-xs text-[#94A3C0] mt-3">v4.0</p>
      </div>
    </aside>
  );
}
