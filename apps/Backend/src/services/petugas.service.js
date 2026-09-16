import { supabase } from '../config/supabase.js';
import { mqttClient, MQTT_TOPIC } from "../config/mqtt.js";

// parkir masuk atau yg masih aktif
export const getParkirAktif = async () => {
    const { data, error } = await supabase
        .from("tb_transaksi")
        .select("*")
        .eq("status", "masuk")
        .order("waktu_masuk", { ascending: false });

    if (error) throw error;
    return data;
};

// parkir keluar (menunggu bayar)
export const getMenungguBayar = async () => {
    const { data, error } = await supabase
        .from("tb_transaksi")
        .select("*")
        .eq("status", "keluar")
        .order("waktu_keluar", { ascending: false });

    if (error) throw error;
    return data;
};

// riwayat parkir (sudah bayar)
export const getRiwayatParkir = async () => {
    const { data, error } = await supabase
        .from("tb_transaksi")
        .select("*")
        .eq("status", "selesai")
        .order("waktu_keluar", { ascending: false });

    if (error) throw error;
    return data;
};

// Buka Palang parkir keluar
export const bukaPalang = async (id) => {
    // Ambil data transaksi
    const { data: transaksi, error } = await supabase
        .from("tb_transaksi")
        .select("*")
        .eq("id_parkir", id)
        .single();

    if (error) throw error;

    // Validasi status harus "keluar" (belum bayar)
    if (transaksi.status !== "keluar") {
        throw new Error("Transaksi tidak valid untuk buka palang");
    }

    // ✅ KIRIM MQTT BUKA PALANG EXIT
    try {
        mqttClient.publish(MQTT_TOPIC.EXIT_SERVO, "OPEN");
        console.log("✅ MQTT buka palang exit dikirim");

        // ✅ Tampilkan pesan di OLED
        mqttClient.publish(MQTT_TOPIC.OLED, "Silakan Keluar");
    } catch (err) {
        console.log("❌ MQTT gagal:", err.message);
    }

    // ✅ Update status jadi "selesai" (sudah bayar)
    const { data, error: updateError } = await supabase
        .from("tb_transaksi")
        .update({
            status: "selesai"
        })
        .eq("id_parkir", id)
        .select()
        .single();

    if (updateError) throw updateError;

    console.log("✅ Status updated to selesai:", data);
    return data;
};