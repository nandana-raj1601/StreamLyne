import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and public API key
const SUPABASE_URL = 'https://ojfkspdmjsjmkfiwepxi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZmtzcGRtanNqbWtmaXdlcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzA3MTksImV4cCI6MjA0ODcwNjcxOX0.TgESEuonZktHSQwCO2TCkcjC7pww1P5MQYa6nKZPwPY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
