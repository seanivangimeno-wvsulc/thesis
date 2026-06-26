-- Supabase Database Schema

-- Users Table
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    birthdate DATE NOT NULL,
    civil_status TEXT NOT NULL,
    password TEXT NOT NULL
);

-- Applications Table
CREATE TABLE public.applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    assistance_type TEXT NOT NULL,
    justification TEXT NOT NULL,
    household_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'Pending Review',
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    control_number TEXT NOT NULL
);

-- Note: RLS (Row Level Security) policies should be configured in the Supabase dashboard 
-- if you plan to restrict data access. For initial testing, you might disable RLS or set up simple policies.
