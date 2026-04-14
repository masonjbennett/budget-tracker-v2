"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: () => (
  <div className="skeleton w-full h-[22rem] rounded-xl" />
)});

const CHART_LAYOUT: any = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { family: "Inter, sans-serif", color: "#555555", size: 12 },
  margin: { l: 80, r: 24, t: 16, b: 56 },
  legend: { bgcolor: "rgba(0,0,0,0)", orientation: "h" as const, y: -0.2, font: { size: 11, color: "#555555" } },
  xaxis: { gridcolor: "rgba(255,255,255,0.04)", linecolor: "rgba(255,255,255,0.06)", linewidth: 1, tickfont: { size: 11, color: "#555555" }, automargin: true },
  yaxis: { gridcolor: "rgba(255,255,255,0.04)", linecolor: "rgba(255,255,255,0.06)", linewidth: 1, tickfont: { size: 11, color: "#555555" }, automargin: true },
  hovermode: "x unified" as const,
  hoverlabel: { bgcolor: "#171717", font: { size: 12, color: "#ededed" }, bordercolor: "rgba(255,255,255,0.1)" },
};

interface ChartProps {
  data: any[];
  layout?: any;
  height?: number;
  className?: string;
}

export default function Chart({ data, layout = {}, height = 350, className = "" }: ChartProps) {
  const merged = {
    ...CHART_LAYOUT,
    height,
    autosize: true,
    xaxis: { ...CHART_LAYOUT.xaxis, ...(layout.xaxis || {}) },
    yaxis: { ...CHART_LAYOUT.yaxis, ...(layout.yaxis || {}) },
    legend: { ...CHART_LAYOUT.legend, ...(layout.legend || {}) },
    ...Object.fromEntries(Object.entries(layout).filter(([k]) => !["xaxis", "yaxis", "legend"].includes(k))),
  };

  return (
    <div className={`card p-3 ${className}`}>
      <Plot
        data={data}
        layout={merged}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%" }}
      />
    </div>
  );
}

export { CHART_LAYOUT };
