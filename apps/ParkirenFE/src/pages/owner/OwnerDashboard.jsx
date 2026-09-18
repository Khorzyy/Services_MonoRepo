import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaChartBar,
  FaCarSide,
  FaHistory,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import DataTable from "../../components/table/AdminTable";
import { fetchWithAuth, postData } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-1 { animation: fadeUp .4s .05s ease both; }
  .fade-2 { animation: fadeUp .4s .12s ease both; }
  .fade-3 { animation: fadeUp .4s .19s ease both; }
  .fade-4 { animation: fadeUp .4s .26s ease both; }
  .fade-5 { animation: fadeUp .4s .33s ease both; }
  .fade-6 { animation: fadeUp .4s .40s ease both; }

  .thin-scroll::-webkit-scrollbar { width: 4px; }
  .thin-scroll::-webkit-scrollbar-track { background: transparent; }
  .thin-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }
`;

/* ── Stat Card ── */
function StatCard({ title, value, icon, color, subtext }) {
  const palette = {
    emerald: {
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valuColor: "text-emerald-700",
      border: "border-emerald-100",
    },
    brand: {
      bg: "bg-brand-50",
      iconBg: "bg-brand-100",
      iconColor: "text-brand-600",
      valuColor: "text-brand-700",
      border: "border-brand-100",
    },
  };
  const p = palette[color] || palette.brand;

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border ${p.border} ${p.bg} px-6 py-5`}
    >
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${p.iconBg} ${p.iconColor} text-xl`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </p>
        <p className={`mt-0.5 text-3xl font-extrabold ${p.valuColor}`}>
          {value}
        </p>
        {subtext && <p className="mt-1 text-xs text-neutral-400">{subtext}</p>}
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ title, badge, badgeColor, children, className = "" }) {
  const badgeMap = {
    brand: "bg-brand-100 text-brand-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };
  return (
    <div
      className={`rounded-2xl border border-neutral-100 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <h2 className="text-base font-bold text-neutral-700">{title}</h2>
        {badge !== undefined && (
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-bold ${badgeMap[badgeColor] || badgeMap.brand}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ── Chart Card Wrapper ── */
function ChartCard({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-100 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-neutral-100 px-6 py-4">
        <h3 className="text-base font-bold text-neutral-700">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function OwnerDashboard() {
  const [incomeData, setIncomeData] = useState([]);
  const [vehicleStats, setVehicleStats] = useState([]);
  const [recentTransaksi, setRecentTransaksi] = useState([]);
  const [stats, setStats] = useState({
    totalPendapatan: 0,
    totalTransaksi: 0,
    totalKendaraan: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // 🔴 State untuk filter bulan
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const saved = localStorage.getItem("ownerSelectedMonth");
    if (saved) return saved;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const navigate = useNavigate();

  /* ── HELPER: Format "YYYY-MM" → "Apr 2026" ── */
  function formatBulanLabel(yyyymm) {
    if (!yyyymm || typeof yyyymm !== "string") return yyyymm;
    const [year, month] = yyyymm.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex] || month} ${year}`;
  }

  /* ── HELPER: Generate options 6 bulan terakhir ── */
  function generateMonthOptions() {
    const options = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      options.push({ value, label: formatBulanLabel(value) });
    }
    return options;
  }

  /* ── HELPER: Filter transaksi by month (timezone-aware) ── */
  function filterTransaksiByMonth(transactions, month) {
    if (!month || !Array.isArray(transactions)) return transactions;

    const [targetYear, targetMonthStr] = month.split("-");
    const targetMonthNum = parseInt(targetMonthStr, 10) - 1;
    const targetYearNum = parseInt(targetYear, 10);

    return transactions.filter((item) => {
      if (!item.waktu_keluar) return false;

      let dateStr = item.waktu_keluar;
      if (!dateStr.endsWith("Z")) dateStr = dateStr + "Z";

      const utcDate = new Date(dateStr);
      const jakartaDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

      const itemYear = jakartaDate.getUTCFullYear();
      const itemMonth = jakartaDate.getUTCMonth();

      return itemYear === targetYearNum && itemMonth === targetMonthNum;
    });
  }

  /* ── MAIN: Load Data (accept optional month param for instant reload) ── */
  async function loadData(monthOverride = null) {
    try {
      // ✅ Gunakan monthOverride jika ada (untuk instant reload), fallback ke state
      const activeMonth = monthOverride || selectedMonth;

      console.log("🔍 Loading data for month:", activeMonth);

      const [incomeRes, vehicleRes, recentRes] = await Promise.all([
        fetchWithAuth("owner/income"),
        fetchWithAuth("owner/vehicle"),
        // ✅ Kirim activeMonth (bukan selectedMonth) agar langsung pakai nilai terbaru
        fetchWithAuth(`owner/recent?month=${activeMonth}`),
      ]);

      const income = Array.isArray(incomeRes)
        ? incomeRes
        : incomeRes?.data || incomeRes?.result || [];

      const vehicle = Array.isArray(vehicleRes)
        ? vehicleRes
        : vehicleRes?.data || vehicleRes?.result || [];

      let recent = Array.isArray(recentRes)
        ? recentRes
        : recentRes?.data || recentRes?.transactions || recentRes?.result || [];

      // 🔒 Fallback filter di frontend jika backend belum support
      if (recent.length > 20 && activeMonth) {
        const filtered = filterTransaksiByMonth(recent, activeMonth);
        console.log(
          `📊 Frontend filter: ${recent.length} → ${filtered.length} items`,
        );
        recent = filtered;
      }

      const formattedIncome = income.map((item) => ({
        bulan: formatBulanLabel(item.bulan),
        total_pendapatan: item.total_pendapatan,
        total_transaksi: item.total_transaksi,
        _rawBulan: item.bulan,
      }));

      formattedIncome.sort((a, b) => {
        if (!a._rawBulan || !b._rawBulan) return 0;
        return b._rawBulan.localeCompare(a._rawBulan);
      });

      const totalPendapatan = formattedIncome.reduce(
        (sum, item) => sum + (item.total_pendapatan || 0),
        0,
      );
      const totalTransaksi = formattedIncome.reduce(
        (sum, item) => sum + (item.total_transaksi || 0),
        0,
      );
      const totalKendaraan =
        vehicle?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

      setIncomeData(formattedIncome);
      setVehicleStats(vehicle);
      setRecentTransaksi(recent);
      setStats({ totalPendapatan, totalTransaksi, totalKendaraan });

      console.log("✅ Data loaded:", {
        income: formattedIncome.length,
        vehicle: vehicle.length,
        recent: recent.length,
      });
    } catch (err) {
      console.error("❌ Failed to load owner ", err);
      if (err?.status === 401 || err?.message?.includes("unauthorized")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // Auto-refresh tiap 5 menit
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /* ── LOGOUT HANDLERS ── */
  async function handleLogout() {
    try {
      await postData("auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      navigate("/", { replace: true });
    }
  }

  function handleLogoutClick() {
    setIsLogoutConfirmOpen(true);
  }

  function handleCancelLogout() {
    setIsLogoutConfirmOpen(false);
  }

  function handleConfirmLogout() {
    setIsLogoutConfirmOpen(false);
    handleLogout();
  }

  /* ── HANDLER: Ganti bulan (INSTANT RELOAD) ── */
  function handleMonthChange(e) {
    const newMonth = e.target.value;

    // ✅ Update state DAN langsung reload dengan nilai baru (bypass async state)
    setSelectedMonth(newMonth);
    localStorage.setItem("ownerSelectedMonth", newMonth);
    loadData(newMonth); // ← Ini kuncinya! Kirim newMonth langsung ke loadData
  }

  const COLORS = ["#6366F1", "#8B5CF6", "#A78BFA"];

  const tableColumns = [
    { header: "Card ID", accessor: "card_id" },
    { header: "Jenis", accessor: "jenis_kendaraan" },
    { header: "Status", accessor: "status" },
    {
      header: "Total",
      accessor: "biaya_total",
      cell: (row) => (
        <span className="font-semibold text-neutral-700">
          Rp {Number(row.biaya_total).toLocaleString("id-ID")}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="jakarta flex h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm font-medium text-neutral-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>

      <div className="jakarta min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          {/* ── Header ── */}
          <div className="fade-1 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0a0b0d] px-6 py-7 text-white">
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Dashboard Owner
              </h1>
              <p className="mt-0.5 text-sm text-neutral-400">
                Pantau pendapatan dan statistik parkir secara real-time
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* 🔴 Dropdown Filter Bulan */}
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="jakarta rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                title="Pilih bulan"
              >
                {generateMonthOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Tombol Logout */}
              <button
                onClick={handleLogoutClick}
                className="fade-1 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm transition hover:bg-neutral-50 hover:text-red-600 hover:border-red-200 active:scale-95"
                title="Keluar dari akun"
              >
                <FaSignOutAlt className="text-base" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="fade-2 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Total Pendapatan"
              value={`Rp ${stats.totalPendapatan.toLocaleString("id-ID")}`}
              icon={<FaChartBar />}
              color="brand"
              subtext="Semua periode"
            />
            <StatCard
              title="Total Transaksi"
              value={stats.totalTransaksi.toLocaleString("id-ID")}
              icon={<FaHistory />}
              color="brand"
              subtext="Kumulatif"
            />
            <StatCard
              title="Total Kendaraan"
              value={stats.totalKendaraan.toLocaleString("id-ID")}
              icon={<FaCarSide />}
              color="emerald"
              subtext="Tercatat"
            />
          </div>

          {/* ── Charts Section ── */}
          <div className="fade-3 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* BAR CHART */}
            <div className="lg:col-span-2">
              <ChartCard title="Pendapatan per Bulan">
                <div className="h-72">
                  {incomeData.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-neutral-400">
                        Belum ada data pendapatan
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={incomeData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="bulan"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          dy={10}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          tickFormatter={(value) =>
                            `Rp ${(value / 1000).toFixed(0)}k`
                          }
                          domain={[0, "auto"]}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                            fontSize: "13px",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                          formatter={(value) => [
                            `Rp ${Number(value).toLocaleString("id-ID")}`,
                            "Pendapatan",
                          ]}
                          labelStyle={{
                            fontWeight: "600",
                            marginBottom: "4px",
                          }}
                        />
                        <Bar
                          dataKey="total_pendapatan"
                          fill="#6366F1"
                          radius={[6, 6, 0, 0]}
                          animationDuration={500}
                          maxBarSize={100}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            </div>

            {/* PIE CHART */}
            <div className="lg:col-span-1">
              <ChartCard title="Statistik Kendaraan">
                <div className="h-72">
                  {vehicleStats.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-neutral-400">
                        Belum ada data kendaraan
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vehicleStats}
                          dataKey="total"
                          nameKey="jenis_kendaraan"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={45}
                          paddingAngle={2}
                          labelLine={false}
                          label={({ jenis_kendaraan, percent }) => {
                            const percentage = (percent * 100).toFixed(0);
                            return percentage > 10
                              ? `${jenis_kendaraan?.substring(0, 8)}${percentage > 15 ? "\n" : " "}${percentage}%`
                              : "";
                          }}
                          animationDuration={500}
                        >
                          {vehicleStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
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
                          }}
                          formatter={(value) => [
                            `${value} kendaraan`,
                            "Jumlah",
                          ]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            paddingTop: "10px",
                            fontSize: "11px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            </div>
          </div>

          {/* ── Line Chart ── */}
          <div className="fade-4">
            <ChartCard title="Total Transaksi per Bulan">
              <div className="h-72">
                {incomeData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-neutral-400">
                      Belum ada data transaksi
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={incomeData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="bulan"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        dy={10}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        domain={[0, "auto"]}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                          fontSize: "13px",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                        formatter={(value) => [
                          `${value} transaksi`,
                          "Transaksi",
                        ]}
                        labelStyle={{ fontWeight: "600", marginBottom: "4px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total_transaksi"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{
                          fill: "#8B5CF6",
                          strokeWidth: 2,
                          r: 5,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 7, stroke: "#8B5CF6", strokeWidth: 2 }}
                        animationDuration={500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </ChartCard>
          </div>

          {/* ── Recent Transactions Table ── */}
          <div className="fade-5">
            <Section
              title={`Transaksi ${formatBulanLabel(selectedMonth)}`}
              badge={recentTransaksi.length}
              badgeColor="brand"
            >
              <div className="thin-scroll max-h-96 overflow-y-auto">
                {recentTransaksi.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FaHistory className="text-4xl text-neutral-300 mb-3" />
                    <p className="text-sm text-neutral-400">
                      Belum ada transaksi di {formatBulanLabel(selectedMonth)}
                    </p>
                    <p className="text-xs text-neutral-300 mt-1">
                      Pilih bulan lain atau tunggu transaksi baru
                    </p>
                  </div>
                ) : (
                  <DataTable
                    columns={tableColumns}
                    data={recentTransaksi}
                    rowsPerPage={999}
                  />
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI LOGOUT */}
      <Modal
        isOpen={isLogoutConfirmOpen}
        onClose={handleCancelLogout}
        title="Konfirmasi Logout"
      >
        <div className="flex flex-col items-center text-center p-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <p className="text-neutral-700 font-medium mb-1">Yakin ingin keluar?</p>
          <p className="text-neutral-400 text-sm">
            Anda perlu login kembali untuk mengakses dashboard.
          </p>
          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={handleCancelLogout}
              className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 active:scale-95"
            >
              Tidak, Batal
            </button>
            <button
              onClick={handleConfirmLogout}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
            >
              Ya, Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
