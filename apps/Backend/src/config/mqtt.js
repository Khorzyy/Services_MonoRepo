import mqtt from "mqtt";
import dotenv from "dotenv";
import { rfidMasuk, rfidKeluar } from "../services/iot.service.js";
import { io } from "../server.js";

dotenv.config();

/* ── VALIDASI ENV ── */
const requiredEnv = ["MQTT_HOST", "MQTT_PORT", "MQTT_USER", "MQTT_PASS"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    console.error("❌ Missing env vars:", missingEnv.join(", "));
    process.exit(1);
}

/* ── MQTT CONFIG ── */
const options = {
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT, 10),
    protocol: "mqtts",
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    reconnectPeriod: 2000,
    connectTimeout: 10000,
    clientId: `backend_${process.pid}_${Date.now()}`,
    rejectUnauthorized: true,
};

export const mqttClient = mqtt.connect(options);

export const MQTT_TOPIC = {
    ENTRY_RFID: "parking/Ananda/entry/rfid",
    EXIT_RFID: "parking/Ananda/exit/rfid",
    ENTRY_SERVO: "parking/Ananda/entry/servo",
    EXIT_SERVO: "parking/Ananda/exit/servo",
    OLED: "parking/Ananda/oled",
};

/* ── HELPER: Publish MQTT ── */
export function mqttPublish(topic, payload, qos = 1) {
    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, payload, { qos }, (err) => {
            err ? reject(err) : resolve();
        });
    });
}

/* ── HELPER: Emit ke Frontend ── */
function emitToFrontend(event, data) {
    if (io) {
        console.log(`📡 Emitting "${event}" to frontend`);
        io.emit(event, data); // Kirim ke SEMUA client yang terhubung
    }
}

/* ── MQTT EVENTS ── */
mqttClient.on("connect", () => {
    console.log("✅ MQTT Connected");
    mqttClient.subscribe([MQTT_TOPIC.ENTRY_RFID, MQTT_TOPIC.EXIT_RFID], { qos: 1 });
});

mqttClient.on("message", async (topic, message) => {
    const rawUid = message.toString().trim().toUpperCase();
    if (!/^[0-9A-F]{8,20}$/.test(rawUid)) return;

    console.log("📨 MQTT Message:", { topic, uid: rawUid });

    try {
        if (topic === MQTT_TOPIC.ENTRY_RFID) {
            const data = await rfidMasuk(rawUid);

            await Promise.allSettled([
                mqttPublish(MQTT_TOPIC.ENTRY_SERVO, "OPEN"),
                mqttPublish(MQTT_TOPIC.OLED, "Selamat Datang"),
            ]);

            console.log("🚗 Parkir Masuk:", data);
            emitToFrontend("parking-update", {
                type: "entry",
                uid: rawUid,
                data,
                timestamp: new Date().toISOString(),
            });

        } else if (topic === MQTT_TOPIC.EXIT_RFID) {
            const data = await rfidKeluar(rawUid);

            const oledMsg = `Durasi ${data.durasi_jam}J Rp${Number(data.biaya_total).toLocaleString("id-ID")}`;
            await mqttPublish(MQTT_TOPIC.OLED, oledMsg);

            console.log("🚙 Parkir Keluar:", data);
            emitToFrontend("parking-update", {
                type: "exit",
                uid: rawUid,
                data,
                timestamp: new Date().toISOString(),
            });
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
        emitToFrontend("parking-error", { message: err.message });
    }
});

mqttClient.on("error", (err) => console.error("❌ MQTT Error:", err.message));
mqttClient.on("offline", () => console.warn("⚠️ MQTT Offline"));