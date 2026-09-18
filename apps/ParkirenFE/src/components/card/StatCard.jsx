import React from "react";

/* ── Color Palette ── */
const palette = {
  brand: {
    bg: "bg-brand-50",
    iconBg: "bg-brand-100",
    iconColor: "text-brand-600",
    valueColor: "text-brand-700",
    border: "border-brand-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-700",
    border: "border-emerald-100",
  },
  brand: {
    bg: "bg-brand-50",
    iconBg: "bg-brand-100",
    iconColor: "text-brand-600",
    valueColor: "text-brand-700",
    border: "border-brand-100",
  },
  rose: {
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    valueColor: "text-rose-700",
    border: "border-rose-100",
  },
  neutral: {
    bg: "bg-neutral-50",
    iconBg: "bg-neutral-100",
    iconColor: "text-neutral-600",
    valueColor: "text-neutral-700",
    border: "border-neutral-100",
  },
};

export default function StatCard({
  title = "Title",
  value = 0,
  icon,
  color = "brand",
  subtext,
  trend,
  onClick,
  className = "",
}) {
  const p = palette[color] || palette.brand;
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        jakarta flex items-center gap-4 rounded-2xl border ${p.border} ${p.bg} px-6 py-5
        ${isClickable ? "cursor-pointer transition hover:shadow-md active:scale-[0.98]" : ""}
        ${className}
      `}
    >
      {/* Icon Container */}
      <div
        className={`
          flex h-12 w-12 flex-shrink-0 items-center justify-center 
          rounded-xl ${p.iconBg} ${p.iconColor} text-xl
        `}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </p>
        <p className={`mt-0.5 text-3xl font-extrabold ${p.valueColor}`}>
          {value}
        </p>

        {/* Optional Subtext */}
        {subtext && <p className="mt-1 text-xs text-neutral-400">{subtext}</p>}

        {/* Optional Trend Indicator */}
        {trend && (
          <div
            className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold ${
              trend.direction === "up"
                ? "text-emerald-600"
                : trend.direction === "down"
                  ? "text-rose-600"
                  : "text-neutral-500"
            }`}
          >
            {trend.direction === "up" && "📈"}
            {trend.direction === "down" && "📉"}
            {trend.direction === "flat" && "➡️"}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
