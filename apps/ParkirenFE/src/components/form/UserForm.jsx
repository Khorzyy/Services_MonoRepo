import React, { useState } from "react";
import { postData } from "../../api/api";

export default function UserForm({ user, onSuccess, onError }) {
  const isEdit = !!user;
  const [formData, setFormData] = useState({
    nama_lengkap: user?.nama_lengkap || "",
    username: user?.username || "",
    password: "",
    role: user?.role || "petugas",
    status_aktif: user?.status_aktif ?? true, // Default aktif untuk user baru
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.nama_lengkap || !formData.username) {
        throw new Error("Nama dan username wajib diisi");
      }
      if (!isEdit && !formData.password) {
        throw new Error("Password wajib diisi untuk user baru");
      }

      const payload = { ...formData };
      if (isEdit && !formData.password) {
        delete payload.password;
      }

      const endpoint = isEdit ? `admin/user/${user.id_user}` : "admin/user";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-session-id": localStorage.getItem("sessionId"),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan user");
      }

      onSuccess(data);
    } catch (err) {
      console.error("UserForm error:", err);
      setError(err.message || "Terjadi kesalahan");
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Nama Lengkap */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-neutral-700">
          Nama Lengkap <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="nama_lengkap"
          value={formData.nama_lengkap}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          required
        />
      </div>

      {/* Username */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-neutral-700">
          Username <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Masukkan username"
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-neutral-700">
          Password {!isEdit && <span className="text-rose-500">*</span>}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={
            isEdit ? "Kosongkan jika tidak diubah" : "Masukkan password"
          }
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          required={!isEdit}
        />
      </div>

      {/* Role */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-neutral-700">
          Role <span className="text-rose-500">*</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          required
        >
          <option value="admin">Admin</option>
          <option value="petugas">Petugas</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* Status Aktif (Checkbox) */}
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <input
          type="checkbox"
          name="status_aktif"
          id="status_aktif"
          checked={formData.status_aktif}
          onChange={handleChange}
          className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
        />
        <label
          htmlFor="status_aktif"
          className="text-sm font-semibold text-neutral-700"
        >
          User Aktif
        </label>
        <span className="ml-auto text-xs text-neutral-400">
          {formData.status_aktif ? "✅ Bisa login" : "❌ Tidak bisa login"}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : isEdit ? "Update User" : "Tambah User"}
      </button>
    </form>
  );
}
