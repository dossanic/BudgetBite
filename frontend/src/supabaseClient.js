import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbuskphymdrcqkjapszk.supabase.co';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidXNrcGh5bWRyY3FramFwc3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjgxNjksImV4cCI6MjA5MzUwNDE2OX0.-NvGvEwOt5Zjaf29vx_aVpAUXd9GpsWEOO8KjVkUhsI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);