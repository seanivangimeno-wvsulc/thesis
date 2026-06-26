import { createClient } from '@supabase/supabase-js';

// We map process.env variables to VITE_ so they are accessible in Vite
// Using direct string fallbacks to ensure it works immediately on Vercel 
// without requiring manual environment variable configuration, as requested.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxrblxmtztzxjikebsmn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cmJseG10enR6eGppa2Vic21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MzY1ODYsImV4cCI6MjA5ODAxMjU4Nn0.Bet7-uU75HGrGmjWMvRnztplJX9stRxWLugoy47XgBA';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
