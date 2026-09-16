// utils/bcrypt.js
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (plain, hash) => {
    return bcrypt.compare(plain, hash);
};