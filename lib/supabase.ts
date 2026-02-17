import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lcylpkvdfrkfqihfwhkn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TPgTnaYyd8TzNfYcsIvjNQ_imYR3Nep';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
