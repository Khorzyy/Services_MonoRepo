import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// config link into database
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default supabase;