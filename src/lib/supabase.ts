import { createClient } from '@supabase/supabase-js';

// We map process.env variables to VITE_ so they are accessible in Vite, 
// OR we assume they are already defined as VITE_SUPABASE_URL in .env
// Based on the user's .env file, they were SUPABASE_URL and SUPABASE_KEY.
// In Vite, we need them to be prefixed with VITE_. 
// Let's use import.meta.env first, and handle fallback for the current names if we must, 
// but Vite requires VITE_ prefix.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing! Ensure you renamed variables in .env to VITE_SUPABASE_URL and VITE_SUPABASE_KEY if using Vite.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
