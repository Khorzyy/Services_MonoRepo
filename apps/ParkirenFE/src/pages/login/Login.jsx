import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../api/api";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaTimes } from "react-icons/fa";
import Logo from "../../assets/LogoParkiRent2.png";
import Modal from "../../components/modal/Modal";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up-1 { animation: fadeUp .5s .05s ease both; }
  .fade-up-2 { animation: fadeUp .5s .15s ease both; }
  .fade-up-3 { animation: fadeUp .5s .25s ease both; }
  .fade-up-4 { animation: fadeUp .5s .35s ease both; }
  .fade-up-5 { animation: fadeUp .5s .45s ease both; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .floating { animation: float 3s ease-in-out infinite; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-4px); }
    40%, 80% { transform: translateX(4px); }
  }
  .shake { animation: shake .35s ease; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 9999px;
    animation: spin .65s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* Custom Input Focus */
  .input-field {
    transition: all .15s ease;
  }
  .input-field:focus {
    border-color: #0052ff !important;
    box-shadow: 0 0 0 4px rgba(0,82,255,.14);
    outline: none;
  }
  .input-field.error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 4px rgba(239,68,68,.15);
  }

  /* Glass effect */
  .glass {
    background: rgba(255,255,255,.95);
    backdrop-filter: blur(12px);
  }

  /* Terms Content Styles */
  .terms-content {
    max-height: 60vh;
    overflow-y: auto;
  }
  .terms-content::-webkit-scrollbar {
    width: 6px;
  }
  .terms-content::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 9999px;
  }
  .terms-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
  }
  .terms-content h4 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1e293b;
    margin: 1rem 0 0.5rem 0;
  }
  .terms-content h4:first-child {
    margin-top: 0;
  }
  .terms-content p {
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.6;
    margin: 0.25rem 0;
  }
  .terms-content ul {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }
  .terms-content li {
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.6;
    margin: 0.25rem 0;
  }
  .terms-highlight {
    background: #eff4ff;
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
    font-weight: 600;
    color: #0052ff;
  }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  // 🔴 State untuk modal Syarat & Ketentuan
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const navigate = useNavigate();

  // Load remembered username on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("rememberedUsername");
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  // Validation
  const usernameError =
    touched.username && username.length < 3
      ? "Username minimal 3 karakter"
      : "";
  const passwordError =
    touched.password && password.length < 6
      ? "Password minimal 6 karakter"
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });

    if (usernameError || passwordError) return;

    setError("");
    setLoading(true);

    try {
      const res = await postData("auth/login", { username, password });

      if (res?.sessionId && res?.user) {
        // Save session
        localStorage.setItem("sessionId", res.sessionId);
        localStorage.setItem("user", JSON.stringify(res.user));

        // Remember me
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        // Redirect based on role
        const role = res.user.role;
        if (role === "admin") navigate("/admin");
        else if (role === "owner") navigate("/owner");
        else if (role === "petugas") navigate("/petugas");
        else navigate("/");
      } else {
        setError(res?.message || "Username atau password salah.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 🔴 Handlers untuk modal Terms
  const handleOpenTerms = () => setIsTermsOpen(true);
  const handleCloseTerms = () => setIsTermsOpen(false);

  return (
    <>
      <style>{css}</style>

      <div className="jakarta flex min-h-screen bg-white">
        {/* ══════════════════════════════
            LEFT — Branding panel (Enhanced)
        ══════════════════════════════ */}
        <div className="relative hidden flex-1 overflow-hidden bg-[#0a0b0d] lg:flex lg:flex-col lg:justify-between lg:p-14">
          {/* Animated Background Blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl floating" />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl floating"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="pointer-events-none absolute bottom-40 right-10 h-40 w-40 rounded-full bg-brand-300/20 blur-2xl floating"
            style={{ animationDelay: "2s" }}
          />

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Logo - Login Desktop */}
          <div className="relative z-10 flex items-center gap-3">
            {/* ✅ Container: h-16 w-16, Logo: h-12 w-12 */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 shadow-lg shadow-brand-900/20">
              <img
                src={Logo}
                alt="ParkiRent"
                className="h-12 w-12 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              ParkiRent
            </span>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-100 backdrop-blur-sm">
              ✨ Sistem Terpadu
            </p>
            <h1 className="mb-5 text-4xl font-extrabold leading-snug text-white">
              Kelola lahan parkir
              <br />
              lebih <span className="text-brand-200">mudah</span> &amp;
              <br />
              <span className="text-brand-200">efisien</span>
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-brand-200/90">
              Platform all-in-one untuk admin, owner, dan petugas. Monitor,
              kelola, dan analisa dalam satu dashboard yang intuitif.
            </p>
          </div>

          {/* Features Preview */}
          <div className="relative z-10 flex flex-wrap gap-3 border-t border-white/20 pt-8">
            {[
              "📊 Real-time Analytics",
              "🔐 Secure Access",
              "📱 Mobile Ready",
            ].map((feat, i) => (
              <span
                key={i}
                className="fade-up-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            RIGHT — Login form (Enhanced)
        ══════════════════════════════ */}
        <div className="flex w-full flex-col items-center justify-center bg-white/80 px-6 py-12 lg:w-[580px] lg:flex-shrink-0 lg:px-16 lg:backdrop-blur-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl shadow-lg">
              <img
                src={Logo}
                alt="ParkiRent"
                className="h-14 w-14 object-contain"
              />
            </div>
            <span className="text-lg font-bold text-brand-600">ParkiRent</span>
          </div>

          <div className="w-full max-w-md">
            {/* Header */}
            <div className="fade-up-1 mb-9">
              <h2 className="text-3xl font-extrabold text-neutral-800">
                Selamat datang 👋
              </h2>
              <p className="mt-2 text-base text-neutral-500">
                Masuk untuk melanjutkan ke dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username */}
              <div className="fade-up-2">
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-neutral-700"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <FaUser className="h-5 w-5" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="masukkan username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (touched.username && e.target.value.length >= 3) {
                        setTouched((prev) => ({ ...prev, username: false }));
                      }
                    }}
                    onBlur={() => handleBlur("username")}
                    autoComplete="username"
                    required
                    disabled={loading}
                    className={`input-field w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-base text-neutral-700 placeholder-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
                      usernameError ? "error" : ""
                    }`}
                  />
                  {touched.username &&
                    !usernameError &&
                    username.length >= 3 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                        ✓
                      </span>
                    )}
                </div>
                {usernameError && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠️</span> {usernameError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="fade-up-3">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-neutral-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <FaLock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password && e.target.value.length >= 6) {
                        setTouched((prev) => ({ ...prev, password: false }));
                      }
                    }}
                    onBlur={() => handleBlur("password")}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className={`input-field w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-12 pr-12 text-base text-neutral-700 placeholder-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed ${
                      passwordError ? "error" : ""
                    }`}
                  />
                  {/* Toggle Password Visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50"
                    title={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                  {/* Password Strength Indicator */}
                  {password.length > 0 && !passwordError && (
                    <div className="absolute -bottom-5 left-0 flex gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-8 rounded-full transition ${
                            password.length > (i + 1) * 4
                              ? i < 2
                                ? "bg-brand-400"
                                : "bg-emerald-500"
                              : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {passwordError && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠️</span> {passwordError}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="shake fade-up-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <span className="mt-0.5 text-base">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="fade-up-5 pt-2">
                <button
                  type="submit"
                  disabled={loading || !!usernameError || !!passwordError}
                  className="group relative w-full overflow-hidden rounded-xl bg-brand-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-200 transition-all duration-200 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-300 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    className={`flex items-center justify-center gap-2 transition ${loading ? "opacity-0" : "opacity-100"}`}
                  >
                    Login
                    <svg
                      className="h-4 w-4 transition group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="spin" />
                      Memverifikasi...
                    </span>
                  )}
                  {/* Hover Effect */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full duration-700" />
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-xs text-neutral-400">
                Dengan masuk, Anda menyetujui{" "}
                {/* 🔴 Tombol Syarat & Ketentuan yang bisa diklik */}
                <button
                  type="button"
                  onClick={handleOpenTerms}
                  className="font-medium text-brand-600 hover:text-brand-700 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
                >
                  Syarat & Ketentuan
                </button>
              </p>
              <p className="mt-3 text-xs text-neutral-300">
                ParkiRent Dashboard &copy; 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 MODAL SYARAT & KETENTUAN */}
      <Modal
        isOpen={isTermsOpen}
        onClose={handleCloseTerms}
        title="Syarat & Ketentuan Penggunaan"
      >
        <div className="terms-content text-sm text-neutral-600 pr-2">
          <p className="mb-3">
            Selamat datang di <span className="terms-highlight">ParkiRent</span>
            . Dengan mengakses dan menggunakan sistem ini, Anda setuju untuk
            mematuhi syarat dan ketentuan berikut:
          </p>

          <h4>🔐 1. Keamanan Akun</h4>
          <ul>
            <li>
              Anda bertanggung jawab penuh atas kerahasiaan username dan
              password.
            </li>
            <li>Jangan membagikan kredensial login kepada pihak lain.</li>
            <li>Segera laporkan jika mencurigai adanya akses tidak sah.</li>
          </ul>

          <h4>🚗 2. Penggunaan Sistem Parkir</h4>
          <ul>
            <li>
              Data parkir yang tercatat bersifat{" "}
              <span className="terms-highlight">final dan mengikat</span>.
            </li>
            <li>
              Petugas wajib memverifikasi identitas kendaraan sebelum membuka
              palang.
            </li>
            <li>
              Owner/admin berhak memantau seluruh aktivitas sistem secara
              real-time.
            </li>
          </ul>

          <h4>📊 3. Privasi & Data</h4>
          <ul>
            <li>
              Data pribadi pengguna dilindungi sesuai kebijakan privasi
              internal.
            </li>
            <li>
              Data transaksi parkir disimpan untuk keperluan audit dan
              pelaporan.
            </li>
            <li>
              Kami tidak menjual atau membagikan data ke pihak ketiga tanpa
              izin.
            </li>
          </ul>

          <h4>⚠️ 4. Pembatasan Tanggung Jawab</h4>
          <ul>
            <li>
              Sistem tidak bertanggung jawab atas kerugian akibat kelalaian
              pengguna.
            </li>
            <li>
              Gangguan teknis di luar kendali kami (force majeure) bukan alasan
              klaim.
            </li>
            <li>
              Pengguna setuju untuk tidak melakukan reverse engineering pada
              sistem.
            </li>
          </ul>

          <h4>🔄 5. Perubahan Ketentuan</h4>
          <ul>
            <li>Kami berhak memperbarui syarat ini sewaktu-waktu.</li>
            <li>
              Pengguna akan diberitahu melalui notifikasi sistem jika ada
              perubahan signifikan.
            </li>
            <li>
              Penggunaan berkelanjutan setelah perubahan = persetujuan terhadap
              versi terbaru.
            </li>
          </ul>

          <div className="mt-6 rounded-lg bg-brand-50 border border-brand-100 p-4">
            <p className="text-xs text-brand-700">
              💡 <strong>Tip:</strong> Simpan halaman ini atau screenshot untuk
              referensi di masa mendatang.
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            onClick={handleCloseTerms}
            className="px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition active:scale-95"
          >
            Tutup
          </button>
          <button
            onClick={handleCloseTerms}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition active:scale-95"
          >
            Saya Paham
          </button>
        </div>
      </Modal>
    </>
  );
}
