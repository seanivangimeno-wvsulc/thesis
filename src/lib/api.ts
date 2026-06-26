import { supabase } from './supabase';
import { User, AICSApplication } from '../types';

/**
 * USERS API
 */

// Get user by email
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
    console.error('Error fetching user by email:', error);
    throw error;
  }
  
  return data;
}

// Create a new user
export async function createUser(userData: any) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  return data;
}

/**
 * APPLICATIONS API
 */

// Fetch all applications (for admins or general fetch)
export async function getApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
  
  return data;
}

// Fetch applications by specific user ID
export async function getApplicationsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('submission_date', { ascending: false });

  if (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
  
  return data;
}

// Create a new application
export async function createApplication(applicationData: any) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    throw error;
  }
  
  return data;
}

// Update application status
export async function updateApplicationStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
  
  return data;
}
