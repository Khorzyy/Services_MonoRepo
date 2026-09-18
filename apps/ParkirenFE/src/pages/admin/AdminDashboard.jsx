import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaEdit,
  FaPlus,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import DataTable from "../../components/table/AdminTable";
import { fetchWithAuth, postData } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import UserForm from "../../components/form/UserForm";
import TarifForm from "../../components/form/TarifForm";

/* ── CSS & Animations ── */
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

  .thin-scroll::-webkit-scrollbar { width: 4px; }
  .thin-scroll::-webkit-scrollbar-track { background: transparent; }
  .thin-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }
`;

/* ── Stat Card ── */
function StatCard({ title, value, icon, color, subtext }) {
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
        <p className={`mt-0.5 text-3xl font-extrabold ${p.valueColor}`}>
          {value}
        </p>
        {subtext && <p className="mt-1 text-xs text-neutral-400">{subtext}</p>}
      </div>
    </div>
  );
}

/* ── Section Wrapper ── */
function Section({ title, badge, badgeColor, children, actions }) {
  const badgeMap = {
    brand: "bg-brand-100 text-brand-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <h2 className="text-base font-bold text-neutral-700">{title}</h2>
        <div className="flex items-center gap-3">
          {badge !== undefined && (
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${badgeMap[badgeColor] || badgeMap.brand}`}
            >
              {badge}
            </span>
          )}
          {actions}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ── Action Cell for User (Edit Only) ── */
function UserActionCell({ onEdit }) {
  return (
    <button
      onClick={onEdit}
      className="inline-flex items-center justify-center rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-100 active:scale-95"
      title="Edit Data"
    >
      <FaEdit className="mr-1" /> Edit
    </button>
  );
}

/* ── Action Cell for Tarif (Edit Only) ── */
function TarifActionCell({ onEdit }) {
  return (
    <button
      onClick={onEdit}
      className="inline-flex items-center justify-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 active:scale-95"
      title="Edit Tarif"
    >
      <FaEdit className="mr-1" /> Edit
    </button>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tarif, setTarif] = useState([]);
  const [stats, setStats] = useState({ user: 0, tarif: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ── Modal State ── */
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTarifModalOpen, setIsTarifModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingTarif, setEditingTarif] = useState(null);

  /* ── Load Data ── */
  async function loadData() {
    try {
      const [userRes, tarifRes] = await Promise.all([
        fetchWithAuth("admin/user"),
        fetchWithAuth("admin/tarif"),
      ]);

      const userList = userRes?.data ?? userRes ?? [];
      const tarifList = tarifRes?.data ?? tarifRes ?? [];

      setUsers(userList);
      setTarif(tarifList);
      setStats({
        user: userList.length,
        tarif: tarifList.length,
      });
    } catch (err) {
      console.error("❌ Failed to load admin ", err);
      if (err?.status === 401 || err?.message?.includes("unauthorized")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ── Logout Handlers ── */

  // Fungsi inti logout (untuk auto-logout saat session expired / 401)
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

  // Buka modal konfirmasi (dipanggil saat tombol Logout diklik manual)
  function handleLogoutClick() {
    setIsLogoutConfirmOpen(true);
  }

  // Tutup modal konfirmasi (Batal)
  function handleCancelLogout() {
    setIsLogoutConfirmOpen(false);
  }

  // Eksekusi logout setelah user klik "Ya" di modal
  function handleConfirmLogout() {
    setIsLogoutConfirmOpen(false);
    handleLogout();
  }

  /* ── User Modal Handlers ── */
  function handleAddUser() {
    setEditingUser(null);
    setIsUserModalOpen(true);
  }

  function handleEditUser(user) {
    setEditingUser(user);
    setIsUserModalOpen(true);
  }

  function handleCloseUserModal() {
    setIsUserModalOpen(false);
    setEditingUser(null);
  }

  function handleUserFormSuccess() {
    handleCloseUserModal();
    loadData();
    alert("User berhasil disimpan!");
  }

  /* ── Tarif Modal Handlers ── */
  function handleAddTarif() {
    setEditingTarif(null);
    setIsTarifModalOpen(true);
  }

  function handleEditTarif(t) {
    setEditingTarif(t);
    setIsTarifModalOpen(true);
  }

  function handleCloseTarifModal() {
    setIsTarifModalOpen(false);
    setEditingTarif(null);
  }

  function handleTarifFormSuccess() {
    handleCloseTarifModal();
    loadData();
    alert("Tarif berhasil disimpan!");
  }

  /* ── Table Columns ── */
  const userColumns = [
    { header: "Nama", accessor: "nama_lengkap" },
    { header: "Email", accessor: "username" },
    {
      header: "Role",
      accessor: "role",
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.role === "admin"
              ? "bg-brand-100 text-brand-700"
              : row.role === "petugas"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-brand-100 text-brand-700"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status_aktif",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.status_aktif
              ? "bg-emerald-50 text-emerald-600"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              row.status_aktif ? "bg-emerald-500" : "bg-neutral-400"
            }`}
          />
          {row.status_aktif ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: "action",
      cell: (row) => <UserActionCell onEdit={() => handleEditUser(row)} />,
    },
  ];

  const tarifColumns = [
    { header: "Jenis Kendaraan", accessor: "jenis_kendaraan" },
    {
      header: "Tarif / Jam",
      accessor: "tarif_per_jam",
      cell: (row) => (
        <span className="font-semibold text-neutral-700">
          Rp {Number(row.tarif_per_jam).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: "action",
      cell: (row) => <TarifActionCell onEdit={() => handleEditTarif(row)} />,
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
                Dashboard Admin
              </h1>
              <p className="mt-0.5 text-sm text-neutral-400">
                Kelola user dan tarif sistem parkir
              </p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="fade-1 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm transition hover:bg-neutral-50 hover:text-red-600 hover:border-red-200 active:scale-95"
              title="Keluar dari akun"
            >
              <FaSignOutAlt className="text-base" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* ── Stat Cards ── */}
          <div className="fade-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatCard
              title="Total User"
              value={stats.user}
              icon={<FaUsers />}
              color="brand"
              subtext="Terdaftar"
            />
            <StatCard
              title="Total Tarif"
              value={stats.tarif}
              icon={<FaMoneyBillWave />}
              color="emerald"
              subtext="Aktif"
            />
          </div>

          {/* ── Manajemen User ── */}
          <div className="fade-3">
            <Section
              title="Manajemen User"
              badge={users.length}
              badgeColor="brand"
              actions={
                <button
                  onClick={handleAddUser}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-700 active:scale-95"
                >
                  <FaPlus /> Tambah User
                </button>
              }
            >
              <div className="thin-scroll max-h-72 overflow-y-auto">
                <DataTable columns={userColumns} data={users} rowsPerPage={5} />
              </div>
            </Section>
          </div>

          {/* ── Manajemen Tarif ── */}
          <div className="fade-4">
            <Section
              title="Manajemen Tarif"
              badge={tarif.length}
              badgeColor="emerald"
            >
              <div className="thin-scroll max-h-72 overflow-y-auto">
                <DataTable
                  columns={tarifColumns}
                  data={tarif}
                  rowsPerPage={5}
                />
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* ── MODAL USER (Add/Edit) ── */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        title={editingUser ? "Edit User" : "Tambah User Baru"}
      >
        <UserForm
          user={editingUser}
          onSuccess={handleUserFormSuccess}
          onError={() => {}}
        />
      </Modal>

      {/* ── MODAL TARIF (Add/Edit) ── */}
      <Modal
        isOpen={isTarifModalOpen}
        onClose={handleCloseTarifModal}
        title={editingTarif ? "Edit Tarif" : "Tambah Tarif Baru"}
      >
        <TarifForm
          tarif={editingTarif}
          onSuccess={handleTarifFormSuccess}
          onError={() => {}}
        />
      </Modal>

      {/* ── MODAL KONFIRMASI LOGOUT ── */}
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
