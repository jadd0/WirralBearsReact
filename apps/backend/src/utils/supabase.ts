import { createClient } from '@supabase/supabase-js';

// Check if we're in development and missing Supabase env vars
const isLocalDevelopment =
	process.env.NODE_ENV === 'development' &&
	(!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY);

// Local Supabase configuration (default ports from supabase start)
const localSupabaseUrl = 'http://localhost:54321';
const localSupabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Production/remote Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(
	isLocalDevelopment ? localSupabaseUrl : supabaseUrl,
	isLocalDevelopment ? localSupabaseAnonKey : supabaseAnonKey
);

// Export configuration info for debugging
export const supabaseConfig = {
	isLocal: isLocalDevelopment,
	url: isLocalDevelopment ? localSupabaseUrl : supabaseUrl,
	environment: process.env.NODE_ENV || 'development',
};
