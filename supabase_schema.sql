-- Run this in your Supabase Dashboard SQL Editor to add the new fields
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS clientele_categories JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS impression_findings TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS recommendation TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS applicant_address TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS applicant_birthdate TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS applicant_civil_status TEXT DEFAULT '';
