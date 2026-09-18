import React, { useEffect, useState } from "react";
import {
  FaCar,
  FaMoneyBillWave,
  FaHistory,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaWifi,
  FaBan,
} from "react-icons/fa";
import DataTable from "../../components/table/AdminTable";
import { fetchWithAuth, postData } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";

// 🔴 IMPORT SOCKET.IO CLIENT
import { io } from "socket.io-client";

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
function StatCard({ title, value, icon, color }) {
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

export default function PetugasDashboard() {
  const [parkirAktif, setParkirAktif] = useState([]);
  const [menungguBayar, setMenungguBayar] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [stats, setStats] = useState({ aktif: 0, bayar: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);

  // 🔴 State untuk modal konfirmasi logout
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // 🔴 State untuk koneksi WebSocket
  const [socketConnected, setSocketConnected] = useState(false);

  const navigate = useNavigate();

  async function loadData() {
    try {
      const [aktif, bayar, selesai] = await Promise.all([
        fetchWithAuth("petugas/parkir-aktif"),
        fetchWithAuth("petugas/menunggu-bayar"),
        fetchWithAuth("petugas/riwayat"),
      ]);
      setParkirAktif(aktif || []);
      setMenungguBayar(bayar || []);
      setRiwayat(selesai || []);
      setStats({
        aktif: aktif?.length || 0,
        bayar: bayar?.length || 0,
        selesai: selesai?.length || 0,
      });
    } catch (err) {
      console.error(err);
      if (err?.status === 401 || err?.message?.includes("unauthorized")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // 🔴 SETUP WEBSOCKET CONNECTION TO BACKEND
    const socket = io(
      process.env.REACT_APP_API_URL || "http://localhost:5000",
      {
        auth: {
          token: localStorage.getItem("token"),
        },
        transports: ["websocket"],
      },
    );

    socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ WebSocket disconnected");
      setSocketConnected(false);
    });

    // 🔴 LISTEN FOR REAL-TIME PARKING UPDATES
    socket.on("parking-update", (data) => {
      console.log("📡 Realtime parking update:", data);
      // Auto-refresh data saat ada event parkir dari backend
      loadData();
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket connection error:", err.message);
      setSocketConnected(false);
    });

    // Cleanup socket on unmount
    return () => {
      socket.disconnect();
      console.log("🔌 WebSocket disconnected");
    };
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

  async function bukaPalang(id) {
    try {
      await postData(`petugas/buka-palang/${id}`);
      alert("Palang dibuka");
      loadData();
    } catch (err) {
      console.error(err);
      if (err?.status === 401) {
        handleLogout();
      }
    }
  }

  /* ── Columns ── */
  const parkirColumns = [
    { header: "Card ID", accessor: "card_id" },
    { header: "Waktu Masuk", accessor: "waktu_masuk" },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {row.status}
        </span>
      ),
    },
  ];

  const bayarColumns = [
    { header: "Card ID", accessor: "card_id" },
    { header: "Masuk", accessor: "waktu_masuk" },
    { header: "Keluar", accessor: "waktu_keluar" },
    { header: "Durasi", accessor: "durasi_jam" },
    {
      header: "Total",
      accessor: "biaya_total",
      cell: (row) => (
        <span className="font-semibold text-neutral-700">
          Rp {Number(row.biaya_total).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: "action",
      cell: (row) => (
        <button
          onClick={() => bukaPalang(row.id_parkir)}
          className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-700 active:scale-95"
        >
          Buka Palang
        </button>
      ),
    },
  ];

  const riwayatColumns = [
    { header: "Card ID", accessor: "card_id" },
    { header: "Masuk", accessor: "waktu_masuk" },
    { header: "Keluar", accessor: "waktu_keluar" },
    { header: "Durasi", accessor: "durasi_jam" },
    {
      header: "Total",
      accessor: "biaya_total",
      cell: (row) => (
        <span className="font-semibold text-neutral-700">
          Rp {Number(row.biaya_total).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-semibold text-neutral-500">
          {row.status}
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
                Dashboard Petugas
              </h1>
              <p className="mt-0.5 text-sm text-neutral-400">
                Monitor kendaraan dan kelola pembayaran parkir
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* 🔴 Indikator Koneksi WebSocket */}
              {/* 🔴 Indikator Koneksi WebSocket */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  socketConnected
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-brand-50 text-brand-600"
                }`}
                title={socketConnected ? "Realtime aktif" : "Menghubungkan..."}
              >
                {socketConnected ? (
                  <FaWifi className="text-sm" />
                ) : (
                  <FaBan className="text-sm" /> // ✅ Ganti dengan FaBan
                )}
                <span className="hidden sm:inline">
                  {socketConnected ? "Realtime" : "Reconnecting"}
                </span>
              </div>

              {/* ── Logout Button ── */}
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
              title="Parkir Aktif"
              value={stats.aktif}
              icon={<FaCar />}
              color="brand"
            />
            <StatCard
              title="Menunggu Pembayaran"
              value={stats.bayar}
              icon={<FaMoneyBillWave />}
              color="brand"
            />
            <StatCard
              title="Riwayat Parkir"
              value={stats.selesai}
              icon={<FaHistory />}
              color="emerald"
            />
          </div>

          {/* ── Kendaraan Sedang Parkir ── */}
          <div className="fade-3">
            <Section
              title="Kendaraan Sedang Parkir"
              badge={stats.aktif}
              badgeColor="brand"
            >
              <div className="thin-scroll max-h-72 overflow-y-auto">
                <DataTable
                  columns={parkirColumns}
                  data={parkirAktif}
                  rowsPerPage={5}
                />
              </div>
            </Section>
          </div>

          {/* ── Menunggu Pembayaran ── */}
          <div className="fade-4">
            <Section
              title="Kendaraan Menunggu Pembayaran"
              badge={stats.bayar}
              badgeColor="brand"
            >
              <div className="thin-scroll max-h-72 overflow-y-auto">
                <DataTable
                  columns={bayarColumns}
                  data={menungguBayar}
                  rowsPerPage={5}
                />
              </div>
            </Section>
          </div>

          {/* ── Riwayat Parkir ── */}
          <div className="fade-5">
            <Section
              title="Riwayat Parkir"
              badge={stats.selesai}
              badgeColor="emerald"
            >
              <div className="thin-scroll max-h-72 overflow-y-auto">
                <DataTable
                  columns={riwayatColumns}
                  data={riwayat}
                  rowsPerPage={5}
                />
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* 🔴 MODAL KONFIRMASI LOGOUT */}
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
