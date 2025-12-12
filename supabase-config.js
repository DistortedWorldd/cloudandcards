// Supabase Configuration
const SUPABASE_URL = 'https://svieszqhaoanetlhmfwk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aWVzenFoYW9hbmV0bGhtZndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTkyNjQsImV4cCI6MjA4MTEzNTI2NH0.ESmBE_Io89VXNSl0aFhkk8YoJbimfNxIwAl-Qf4cnwc';

let supabase;

function initializeSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized successfully');
        return true;
    } else {
        console.error('Supabase SDK not loaded');
        return false;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
    initializeSupabase();
}
