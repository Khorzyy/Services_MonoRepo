import { supabase } from "../config/supabase.js";

/* ================= UTILS ================= */

/**
 * Parse timestamp dari Supabase ke Date object
 * Handle format: "2026-04-01T05:09:09.51" atau "2026-04-01T05:09:09.51Z"
 */
const parseSupabaseTimestamp = (timestampStr) => {
    if (!timestampStr) return new Date();

    let ts = timestampStr;

    // Jika ada koma (misal dari Postgres), ganti ke titik
    ts = ts.replace(',', '.');

    // Jika tidak ada timezone indicator 'Z', tambahkan agar dianggap UTC
    if (!ts.endsWith('Z')) {
        ts = ts + 'Z';
    }

    return new Date(ts);
};

const getUTCTimestamp = () => {
    return new Date().toISOString();
};

// Anti-duplicate request helper (debounce sederhana)
const executedRequests = new Map();
const isDuplicateRequest = (key, ttl = 3000) => {
    const now = Date.now();
    const lastExec = executedRequests.get(key);

    if (lastExec && (now - lastExec) < ttl) {
        return true;
    }

    executedRequests.set(key, now);
    setTimeout(() => executedRequests.delete(key), ttl);
    return false;
};

/* ================= RFID MASUK ================= */
export const rfidMasuk = async (card_id) => {

    const uid = card_id.trim().toUpperCase();

    const requestKey = `masuk:${uid}`;
    if (isDuplicateRequest(requestKey)) {
        return null;
    }

    // Cek apakah kartu ini sudah sedang parkir (status 'masuk')
    const { data: existingList, error: checkError } = await supabase
        .from("tb_transaksi")
        .select("id_parkir")
        .eq("card_id", uid)
        .eq("status", "masuk");

    if (checkError) throw checkError;

    if (existingList && existingList.length > 0) {
        throw new Error("Kendaraan sudah parkir");
    }

    const waktuMasuk = getUTCTimestamp();

    const { data, error } = await supabase
        .from("tb_transaksi")
        .insert({
            card_id: uid,
            waktu_masuk: waktuMasuk,
            id_tarif: 1, // Default tarif, bisa disesuaikan logic-nya
            status: "masuk"
        })
        .select()
        .single();

    if (error) throw error;

    return data;
};

/* ================= RFID KELUAR ================= */
export const rfidKeluar = async (card_id) => {

    const uid = card_id.trim().toUpperCase();

    const requestKey = `keluar:${uid}`;
    if (isDuplicateRequest(requestKey)) {
        return null;
    }

    // Cari transaksi aktif (status 'masuk') terakhir untuk kartu ini
    const { data: list, error } = await supabase
        .from("tb_transaksi")
        .select("*")
        .eq("card_id", uid)
        .eq("status", "masuk")
        .order("waktu_masuk", { ascending: false, nullsFirst: false })
        .limit(1);

    if (error) throw error;

    if (!list || list.length === 0) {
        throw new Error("Kendaraan tidak sedang parkir");
    }

    const transaksi = list[0];

    /* ===== FIX TIMEZONE CALCULATION ===== */
    // Parse waktu masuk dengan fungsi helper yang aman
    const masuk = parseSupabaseTimestamp(transaksi.waktu_masuk).getTime();
    const keluar = Date.now(); // Waktu sekarang dalam UTC timestamp

    const selisihMs = keluar - masuk;
    const selisihJam = selisihMs / 3600000;

    // Minimal 1 jam, pembulatan ke atas
    const durasi = Math.max(1, Math.ceil(selisihJam));

    /* ===== AMBIL TARIF ===== */
    const { data: tarif, error: tarifError } = await supabase
        .from("tb_tarif")
        .select("*")
        .eq("id_tarif", transaksi.id_tarif)
        .single();

    if (tarifError) throw tarifError;

    const biaya = durasi * tarif.tarif_per_jam;

    /* ===== UPDATE TRANSAKSI ===== */
    const { data, error: updateError } = await supabase
        .from("tb_transaksi")
        .update({
            waktu_keluar: getUTCTimestamp(),
            durasi_jam: durasi,
            biaya_total: biaya,
            // ✅ FIX UTAMA: Ubah status menjadi "keluar" (bukan langsung "selesai")
            // Alur: masuk → keluar (sudah exit, tunggu bayar) → selesai (setelah bayar)
            status: "keluar"
        })
        .eq("id_parkir", transaksi.id_parkir)
        .select()
        .single();

    if (updateError) throw updateError;

    // Log untuk debugging
    console.log("🚗 RFID Exit Processed:", {
        uid,
        id_parkir: transaksi.id_parkir,
        durasi_jam: durasi,
        biaya_total: biaya,
        status_baru: "keluar"
    });

    return data;
};

/* ================= KONFIRMASI PEMBAYARAN ================= */
/**
 * Fungsi ini dipanggil saat petugas mengonfirmasi pembayaran telah diterima.
 * Mengubah status dari "keluar" menjadi "selesai".
 */
export const konfirmasiPembayaran = async (id_parkir) => {
    const { data, error } = await supabase
        .from("tb_transaksi")
        .update({
            status: "selesai" // ✅ Ubah dari "keluar" → "selesai"
        })
        .eq("id_parkir", id_parkir)
        .eq("status", "keluar") // Pastikan hanya update yang status-nya "keluar"
        .select()
        .single();

    if (error) throw error;

    console.log("💰 Payment Confirmed:", { id_parkir, status_baru: "selesai" });
    return data;
};