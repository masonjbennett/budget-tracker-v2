"use client";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: "green" | "red" | "default";
  help?: string;
}

export default function MetricCard({ label, value, delta, deltaColor = "default", help }: MetricCardProps) {
  const deltaColorClass = {
    green: "text-green",
    red: "text-red",
    default: "text-dim",
  }[deltaColor];

  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-accent hover:-translate-y-0.5 transition-all duration-300 group">
      <p className="text-xs uppercase tracking-wider text-dim font-medium" title={help}>
        {label}
      </p>
      <p className="text-2xl font-bold text-primary mt-1 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      {delta && (
        <p className={`text-sm mt-1 font-medium ${deltaColorClass}`}>
          {delta}
        </p>
      )}
    </div>
  );
}
