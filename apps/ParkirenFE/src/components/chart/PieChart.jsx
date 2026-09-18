import React from "react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

export default function PieChart({
  data,
  title = "Pie Chart",
  dataKey = "value",
  nameKey = "name",
  colors = ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD"],
  height = 280,
  showLegend = true,
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
            <RePieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                labelLine={false}
                label={({ [nameKey]: name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                animationDuration={500}
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
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
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                />
              )}
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
