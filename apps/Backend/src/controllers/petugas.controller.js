import {
    getParkirAktif,
    getMenungguBayar,
    getRiwayatParkir,
    bukaPalang
} from "../services/petugas.service.js";


// parkir aktif
export const parkirAktif = async (req, res) => {
    try {
        const data = await getParkirAktif();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// menuggu bayar
export const menungguBayar = async (req, res) => {
    try {
        const data = await getMenungguBayar();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// riwayat parkir
export const riwayatParkir = async (req, res) => {
    try {
        const data = await getRiwayatParkir();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// buka palang
export const bukaPalangPetugas = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await bukaPalang(id);
        res.json({
            message: "Palang dibuka",
            data
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });

    }

};