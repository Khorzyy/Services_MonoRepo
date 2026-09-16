import { supabase } from "../config/supabase.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";


// GET ALL USER
export const getAllUser = async () => {
    const { data, error } = await supabase
        .from("tb_user")
        .select("*")
        .order("id_user", { ascending: true });

    if (error) throw error;

    return data;
};


// CREATE USER
export const createUser = async (body) => {
    const { nama_lengkap, username, password, role } = body;

    // Validasi password
    if (!password || password.length < 8) {
        throw new Error("Password minimal 8 karakter");
    }

    // Hash password via util
    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase
        .from("tb_user")
        .insert([{
            nama_lengkap,
            username,
            password: hashedPassword, // ← pakai yang sudah di-hash
            role,
            status_aktif: true
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// UPDATE USER
export const updateUser = async (id, body) => {
    const { nama_lengkap, username, password, role, status_aktif } = body;

    const updateData = {
        nama_lengkap,
        username,
        role,
        status_aktif
    };

    // Hash password hanya jika ada password baru
    if (password && password.trim() !== "") {
        if (password.length < 8) {
            throw new Error("Password minimal 8 karakter");
        }
        updateData.password = await hashPassword(password);
    } else {
        delete updateData.password;
    }

    const { data, error } = await supabase
        .from("tb_user")
        .update(updateData)
        .eq("id_user", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// GET TARIF
export const getTarif = async () => {
    const { data, error } = await supabase
        .from("tb_tarif")
        .select("*")
        .order("id_tarif", { ascending: true });

    if (error) throw error;

    return data;
};


// UPDATE TARIF
export const updateTarif = async (id, body) => {
    const { tarif_per_jam } = body;

    const { data, error } = await supabase
        .from("tb_tarif")
        .update({ tarif_per_jam })
        .eq("id_tarif", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};