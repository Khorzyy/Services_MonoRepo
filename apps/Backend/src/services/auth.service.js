import { supabase } from '../config/supabase.js';
import { comparePassword } from '../utils/bcrypt.js';

export const loginService = async (username, password) => {

    const { data: user, error } = await supabase
        .from('tb_user')
        .select('*')
        .eq('username', username)
        .eq('status_aktif', true)
        .single();

    if (error || !user) {
        throw new Error("User tidak ditemukan");
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
        throw new Error("Password salah");
    }

    return {
        id_user: user.id_user,
        role: user.role,
        nama: user.nama_lengkap
    };
};