const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://dvkshgjdakiycwxdzovk.supabase.co'; // remplace par ton URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2a3NoZ2pkYWtpeWN3eGR6b3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzgwOTIsImV4cCI6MjA2MTcxNDA5Mn0.Qq-cYtYj8tE8pk-PBQo_M92v3XoULWnMbEAhIbD830c';  // remplace par ta clé

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = supabase;