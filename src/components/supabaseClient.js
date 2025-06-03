// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhjombqzhpiyqlannvup.supabase.co'; // ⚠️ Remplace par ton URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoam9tYnF6aHBpeXFsYW5udnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTc4MTEsImV4cCI6MjA1OTE5MzgxMX0.CnYHt_1ekD0C7KgQIs0uQEgVvJaPPPseJLuxFW8C9EY';         // ⚠️ Remplace par ta clé publique

export const supabase = createClient(supabaseUrl, supabaseKey);
