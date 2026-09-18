import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

export default function BarChart({
  data,
  title = "Bar Chart",
  dataKey = "value",
  xAxisKey = "name",
  color = "#6366F1",
  height = 280,
  yAxisFormatter,
  tooltipFormatter,
}) {
  return (
    <>
      <style>{css}</style>
      <div className="jakarta rounded-2xl border border-neutral-100 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-neutral-100 px-6 py-4">
          <h3 className="text-base font-bold text-neutral-700">{title}</h3>
        </div>

        {/* Chart */}
        <div className="p-4" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                tickFormatter={yAxisFormatter}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  padding: "10px 14px",
                }}
                formatter={tooltipFormatter}
              />
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[6, 6, 0, 0]}
                animationDuration={500}
              />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
