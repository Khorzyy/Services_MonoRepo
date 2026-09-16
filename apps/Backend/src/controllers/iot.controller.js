import { rfidMasuk, rfidKeluar } from '../services/iot.service.js';

export const entryRFID = async (req, res) => {

    try {

        const { uid } = req.body;

        const data = await rfidMasuk(uid);

        res.json(data);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

};

export const exitRFID = async (req, res) => {

    try {

        const { uid } = req.body;

        const data = await rfidKeluar(uid);

        res.json(data);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

};