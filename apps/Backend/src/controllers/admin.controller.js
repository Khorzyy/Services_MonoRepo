import {
    getAllUser,
    createUser,
    updateUser,
    getTarif,
    updateTarif
} from "../services/admin.service.js";



// GET
export const getUser = async (req, res) => {
    try {
        const data = await getAllUser();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// CREATE
export const createUserController = async (req, res) => {
    try {
        const data = await createUser(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// UPDATE
export const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await updateUser(id, req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET TARIF
export const getTarifController = async (req, res) => {
    try {
        const data = await getTarif();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// UPDATE TARIF
export const updateTarifController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await updateTarif(id, req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};