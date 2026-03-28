// assets/js/supabase.js

// Replace these with the actual values from your Supabase Project Settings
const supabaseUrl = 'https://rocvxfhihljdgtljceau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvY3Z4ZmhpaGxqZGd0bGpjZWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NDUwNTIsImV4cCI6MjA5MDIyMTA1Mn0.Y6mv3_7ln6Zk3U05AytI0TLFiQBVdlXAye2XIMBOFmE';

// Initialize the client. Because we loaded via CDN, 'supabase' is available on the window object.
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);