"use client";

interface StatusCardProps {
  label: string;
  value: string;
  status: string;
  color: "green" | "yellow" | "red" | "blue";
  description?: string;
}

const colorMap = {
  green: { text: "text-green", bg: "bg-green/10", dot: "bg-green" },
  yellow: { text: "text-yellow", bg: "bg-yellow/10", dot: "bg-yellow" },
  red: { text: "text-red", bg: "bg-red/10", dot: "bg-red" },
  blue: { text: "text-accent", bg: "bg-accent/10", dot: "bg-accent" },
};

export default function StatusCard({ label, value, status, color, description }: StatusCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <p className="text-xs uppercase tracking-wider text-dim font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${c.text}`} style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        <span className={`text-sm font-semibold ${c.text}`}>{status}</span>
      </div>
      {description && (
        <p className="text-xs text-dim mt-2 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
