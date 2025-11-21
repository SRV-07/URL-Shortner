import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UrlRecord {
  id: string;
  short_code: string;
  original_url: string;
  created_at: string;
  clicks: number;
}

export interface UrlClick {
  id: string;
  url_id: string;
  clicked_at: string;
  user_agent: string;
  referrer: string;
}
