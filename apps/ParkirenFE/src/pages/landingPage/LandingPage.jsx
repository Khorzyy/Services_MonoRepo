import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUserTie,
  FaUserCog,
  FaLock,
  FaBuilding,
  FaParking,
} from "react-icons/fa";
import Logo from "../../assets/LogoParkiRent2.png";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
    50% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
  }
  .pulse { animation: pulse-glow 2s infinite; }
`;

/* ── Role Card Component ── */
function RoleCard({ role, title, desc, icon, color, onClick }) {
  const colorClasses = {
    brand: {
      bg: "bg-brand-50",
      border: "border-brand-200",
      iconBg: "bg-brand-100",
      iconColor: "text-brand-600",
      hover: "hover:border-brand-400 hover:shadow-brand-100",
    },
  };

  const c = colorClasses[color] || colorClasses.brand;

  return (
    <button
      onClick={onClick}
      className={`role-card fade-up group flex w-full flex-col items-start rounded-2xl border ${c.border} ${c.bg} p-6 text-left transition hover:shadow-lg ${c.hover} active:scale-[0.98]`}
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${c.iconBg} ${c.iconColor} text-2xl transition group-hover:scale-110`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-neutral-600">
        Masuk sebagai {role}
        <FaLock className="text-[10px]" />
      </span>
    </button>
  );
}

/* ── Main Portal Component ── */
export default function Home() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // Redirect ke login dengan pre-fill role (opsional)
    // Atau langsung ke dashboard jika sudah auth
    navigate("/login", { state: { selectedRole: role } });
  };

  return (
    <>
      <style>{css}</style>
      <div className="jakarta flex min-h-screen bg-white">
        {/* Left Panel - Company Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#0a0b0d] p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 shadow-lg">
              <img src={Logo} alt="ParkiRent" className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ParkiRent</h1>
              <p className="text-sm text-brand-200">Internal Portal</p>
            </div>
          </div>

          {/* Content */}
          <div className="fade-up delay-1">
            <h2 className="text-4xl font-extrabold leading-tight">
              Sistem Manajemen Parkir
              <br />
              <span className="text-brand-200">Terintegrasi</span>
            </h2>
            <p className="mt-6 text-lg text-brand-100/90 max-w-md">
              Platform internal untuk mengelola operasional parkir perusahaan.
              Akses dashboard sesuai peran Anda.
            </p>
          </div>

          {/* System Status */}
          <div className="fade-up delay-2 flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold">Sistem Aktif</p>
              <p className="text-xs text-brand-200">
                Terakhir update: {new Date().toLocaleTimeString("id-ID")}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-brand-200/80">
            <p>© {new Date().getFullYear()} ParkiRent Internal</p>
            <p className="mt-1 text-xs">
              Akses terbatas untuk karyawan terdaftar
            </p>
          </div>
        </div>

        {/* Right Panel - Login Options */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 shadow-lg">
                <img src={Logo} alt="ParkiRent" className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-800">ParkiRent</h1>
                <p className="text-sm text-neutral-400">Internal Portal</p>
              </div>
            </div>

            {/* Header */}
            <div className="fade-up mb-8">
              <h2 className="text-3xl font-extrabold text-neutral-800">
                Selamat Datang
              </h2>
              <p className="mt-2 text-neutral-500">
                Pilih peran Anda untuk melanjutkan
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="space-y-4">
              <RoleCard
                role="Admin"
                title="Administrator"
                desc="Kelola user, tarif, dan konfigurasi sistem"
                icon={<FaUserCog />}
                color="brand"
                onClick={() => handleLogin("admin")}
              />

              <RoleCard
                role="Owner"
                title="Owner / Manajemen"
                desc="Pantau pendapatan dan statistik operasional"
                icon={<FaUserTie />}
                color="brand"
                onClick={() => handleLogin("owner")}
              />

              <RoleCard
                role="Petugas"
                title="Petugas Lapangan"
                desc="Monitor kendaraan dan kelola pembayaran"
                icon={<FaUserShield />}
                color="brand"
                onClick={() => handleLogin("petugas")}
              />
            </div>

            {/* Helper Text */}
            <div className="fade-up delay-3 mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-start gap-3">
                <FaLock className="mt-0.5 text-neutral-400" />
                <div>
                  <p className="text-sm font-semibold text-neutral-700">
                    Akses Terotentikasi
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Pastikan Anda menggunakan akun perusahaan yang valid.
                    Hubungi IT Support jika mengalami kendala akses.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="fade-up delay-3 mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <FaBuilding />
              <span>
                ParkiRent Internal System • {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
