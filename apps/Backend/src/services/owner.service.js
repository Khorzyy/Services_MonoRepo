import { supabase } from "../config/supabase.js";


// income per bulan
export const getIncomePerMonth = async () => {
    const { data, error } = await supabase
        .from("tb_transaksi")
        .select(`waktu_keluar, biaya_total`)
        .eq("status", "selesai");

    if (error) throw error;

    const map = {};

    data.forEach((item) => {
        if (!item.waktu_keluar) return;
        const date = new Date(item.waktu_keluar.endsWith('Z') ? item.waktu_keluar : item.waktu_keluar + 'Z');

        const jakartaDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));

        const year = jakartaDate.getUTCFullYear();
        const month = String(jakartaDate.getUTCMonth() + 1).padStart(2, '0');
        const bulan = `${year}-${month}`;

        if (!map[bulan]) {
            map[bulan] = {
                bulan,
                total_pendapatan: 0,
                total_transaksi: 0
            };
        }

        map[bulan].total_pendapatan += Number(item.biaya_total || 0);
        map[bulan].total_transaksi += 1;
    });

    return Object.values(map);
};


// statistik kendaraan
export const getVehicleStats = async () => {

    const { data, error } = await supabase
        .from("tb_transaksi")
        .select(`
            tb_tarif (
                jenis_kendaraan
            )
        `)
        .eq("status", "selesai");

    if (error) throw error;

    const map = {};

    data.forEach((item) => {
        const jenis = item.tb_tarif?.jenis_kendaraan || "Unknown";

        if (!map[jenis]) {
            map[jenis] = {
                jenis_kendaraan: jenis,
                total: 0
            };
        }

        map[jenis].total += 1;
    });

    return Object.values(map);
};

// transaksi terbaru (dengan filter bulan opsional)
export const getRecentTransaksi = async (month = null) => {
    // Mulai query dasar
    let query = supabase
        .from("tb_transaksi")
        .select(`
            card_id,
            status,
            biaya_total,
            waktu_keluar,
            tb_tarif (
                jenis_kendaraan
            )
        `)
        .eq("status", "selesai");
    if (month) {
        const [year, monthNum] = month.split("-");
        query = query.gte("waktu_keluar", `${year}-${monthNum}-01T00:00:00Z`)
            .lt("waktu_keluar", `${year}-${monthNum}-01T00:00:00Z`, {
                // Tambah 1 bulan untuk upper bound
                foreignTable: null
            });
    }

    query = query.order("waktu_keluar", { ascending: false }).limit(999);

    const { data, error } = await query;

    if (error) throw error;
    let result = data;
    if (month) {
        const [year, monthNum] = month.split("-");
        const targetMonth = parseInt(monthNum, 10) - 1; // 0-indexed
        const targetYear = parseInt(year, 10);

        result = data.filter((item) => {
            if (!item.waktu_keluar) return false;
            const date = new Date(item.waktu_keluar.endsWith('Z') ? item.waktu_keluar : item.waktu_keluar + 'Z');
            const jakartaDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));

            return (
                jakartaDate.getUTCFullYear() === targetYear &&
                jakartaDate.getUTCMonth() === targetMonth
            );
        });
    }

    return result.map((item) => ({
        card_id: item.card_id,
        jenis_kendaraan: item.tb_tarif?.jenis_kendaraan,
        status: item.status,
        biaya_total: item.biaya_total,
        waktu_keluar: item.waktu_keluar,
    }));
};