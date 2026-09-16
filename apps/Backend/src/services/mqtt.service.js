import { mqttClient, MQTT_TOPIC } from "../config/mqtt.js";
import { rfidMasuk, rfidKeluar } from "./iot.service.js";

mqttClient.on("message", async (topic, message) => {

    const card_id = message.toString();

    try {

        if (topic === MQTT_TOPIC.ENTRY_RFID) {

            const data = await rfidMasuk(card_id);

            mqttClient.publish(MQTT_TOPIC.ENTRY_SERVO, "OPEN");

            mqttClient.publish(MQTT_TOPIC.LCD, "Selamat Datang");

            console.log("Kendaraan masuk:", data);

        }

        if (topic === MQTT_TOPIC.EXIT_RFID) {

            const data = await rfidKeluar(card_id);

            mqttClient.publish(MQTT_TOPIC.EXIT_SERVO, "OPEN");

            mqttClient.publish(MQTT_TOPIC.LCD, `Total: Rp${data.biaya_total}`);

            console.log("Kendaraan keluar:", data);

        }

    } catch (err) {

        mqttClient.publish(MQTT_TOPIC.LCD, err.message);

        console.log(err.message);

    }

});