"use client";

interface StatusCardProps {
  label: string;
  value: string;
  status: string;
  color: "green" | "yellow" | "red" | "blue";
  description?: string;
}

const colorMap = {
  green: { text: "text-green", bg: "bg-green/8", dot: "bg-green", border: "border-green/20" },
  yellow: { text: "text-yellow", bg: "bg-yellow/8", dot: "bg-yellow", border: "border-yellow/20" },
  red: { text: "text-red", bg: "bg-red/8", dot: "bg-red", border: "border-red/20" },
  blue: { text: "text-accent", bg: "bg-accent/8", dot: "bg-accent", border: "border-accent/20" },
};

export default function StatusCard({ label, value, status, color, description }: StatusCardProps) {
  const c = colorMap[color];
  return (
    <div className="card animate-fade-in">
      <p className="text-[0.7rem] uppercase tracking-[0.06em] text-dim font-semibold">{label}</p>
      <p className={`text-[2rem] font-bold mt-1.5 leading-tight ${c.text}`} style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <div className={`inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full ${c.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span className={`text-xs font-semibold ${c.text}`}>{status}</span>
      </div>
      {description && (
        <p className="text-[0.78rem] text-dim mt-3 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
