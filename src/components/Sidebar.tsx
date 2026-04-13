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
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#1B2A4A] to-[#1a2d4d] text-white flex flex-col z-50 shadow-xl">
      {/* Header */}
      <div className="text-center py-7 px-5 border-b border-white/8">
        <h1 className="text-[1.35rem] font-bold text-[#7DD3FC] tracking-tight leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          Budget Tracker
        </h1>
        <p className="text-[0.8rem] text-white/60 italic mt-1.5">Track your money. Plan your future.</p>
        <p className="text-[0.7rem] text-[#64748B] mt-1">
          by{" "}
          <a href="https://masonjbennett.com" target="_blank" rel="noopener noreferrer"
             className="text-[#94A3B8] hover:text-white font-medium">
            Mason Bennett
          </a>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 scrollbar-thin">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            <p className={`text-[0.6rem] uppercase tracking-[0.14em] text-[#64748B] font-semibold ml-2 mb-1.5 ${gi === 0 ? "mt-3" : "mt-5 pt-3 border-t border-white/6"}`}>
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.85rem] mb-0.5 transition-all duration-200 relative ${
                    active
                      ? "bg-white/10 text-white font-semibold shadow-sm"
                      : "text-[#94A3B8] hover:bg-white/5 hover:text-[#CBD5E1]"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#7DD3FC] rounded-r-full" />
                  )}
                  <span className="text-[1rem] w-5 text-center">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/6">
        <Link href="/data" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.85rem] text-[#94A3B8] hover:bg-white/5 hover:text-[#CBD5E1] transition-all">
          <span className="text-[1rem] w-5 text-center">💾</span>
          Data Management
        </Link>
        <button className="w-full mt-2 py-2.5 px-4 bg-[#2E86AB]/20 border border-[#2E86AB]/30 rounded-lg text-[0.82rem] text-[#7DD3FC] font-medium hover:bg-[#2E86AB]/35 transition-all">
          Save to Cloud
        </button>
        <p className="text-center text-[0.65rem] text-[#475569] mt-3">v4.0</p>
      </div>
    </aside>
  );
}
