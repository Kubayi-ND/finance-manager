import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gjhivfsmwkkwtqzedquh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaGl2ZnNtd2trd3RxemVkcXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTY1NzcsImV4cCI6MjA2MzQ5MjU3N30.hrELONODCxxt-zEPXNyVJhrSeiTgNI3f9pa10qJbtJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);