import {
    getIncomePerMonth,
    getVehicleStats,
    getRecentTransaksi
} from "../services/owner.service.js";


// income chart
export const incomePerMonth = async (req, res) => {
    try {
        const data = await getIncomePerMonth();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// vehicle stats
export const vehicleStats = async (req, res) => {
    try {
        const data = await getVehicleStats();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// transaksi terbaru
export const recentTransaksi = async (req, res) => {
    try {
        const data = await getRecentTransaksi();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};