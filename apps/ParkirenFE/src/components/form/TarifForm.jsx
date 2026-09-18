import React, { useState } from "react";

export default function TarifForm({ tarif, onSuccess, onError }) {
  const isEdit = !!tarif;
  const [formData, setFormData] = useState({
    jenis_kendaraan: tarif?.jenis_kendaraan || "",
    tarif_per_jam: tarif?.tarif_per_jam || "",
    tarif_maksimal: tarif?.tarif_maksimal || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Hanya angka untuk field harga
    const numericValue = name.includes("tarif")
      ? value.replace(/[^0-9]/g, "")
      : value;
    setFormData({ ...formData, [name]: numericValue });
  };

  const formatRupiah = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("id-ID");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validasi
      if (!formData.jenis_kendaraan || !formData.tarif_per_jam) {
        throw new Error("Jenis kendaraan dan tarif per jam wajib diisi");
      }

      // Prepare payload (convert string to number)
      const payload = {
        jenis_kendaraan: formData.jenis_kendaraan,
        tarif_per_jam: Number(formData.tarif_per_jam),
        tarif_maksimal: formData.tarif_maksimal
          ? Number(formData.tarif_maksimal)
          : null,
      };

      // API Call
      const endpoint = isEdit ? `admin/tarif/${tarif.id_tarif}` : "admin/tarif";
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
        throw new Error(data.message || "Gagal menyimpan tarif");
      }

      onSuccess(data);
    } catch (err) {
      console.error("TarifForm error:", err);
      setError(err.message || "Terjadi kesalahan");
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Jenis Kendaraan */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-700">
          Jenis Kendaraan <span className="text-rose-500">*</span>
        </label>
        <select
          name="jenis_kendaraan"
          value={formData.jenis_kendaraan}
          onChange={handleChange}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          required
        >
          <option value="">Pilih jenis kendaraan</option>
          <option value="motor">Motor</option>
          <option value="mobil">Mobil</option>
          <option value="truk">Truk</option>
          <option value="bus">Bus</option>
        </select>
      </div>

      {/* Tarif Per Jam */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-700">
          Tarif Per Jam (Rp) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            Rp
          </span>
          <input
            type="text"
            name="tarif_per_jam"
            value={
              formData.tarif_per_jam ? formatRupiah(formData.tarif_per_jam) : ""
            }
            onChange={handleChange}
            placeholder="2.000"
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm text-neutral-700 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : isEdit ? "Update Tarif" : "Tambah Tarif"}
      </button>
    </form>
  );
}
