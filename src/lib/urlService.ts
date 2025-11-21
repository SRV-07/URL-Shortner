import { supabase } from './supabase';

function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function shortenUrl(originalUrl: string): Promise<{ shortCode: string; error?: string }> {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const shortCode = generateShortCode();

    const { data: existing } = await supabase
      .from('urls')
      .select('short_code')
      .eq('short_code', shortCode)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase
        .from('urls')
        .insert({ short_code: shortCode, original_url: originalUrl });

      if (error) {
        return { shortCode: '', error: error.message };
      }

      return { shortCode };
    }

    attempts++;
  }

  return { shortCode: '', error: 'Failed to generate unique short code' };
}

export async function getUrlByShortCode(shortCode: string) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('short_code', shortCode)
    .maybeSingle();

  return { data, error };
}

export async function getAllUrls() {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function deleteUrl(id: string) {
  const { error } = await supabase
    .from('urls')
    .delete()
    .eq('id', id);

  return { error };
}

export async function trackClick(urlId: string, userAgent: string, referrer: string) {
  await supabase
    .from('url_clicks')
    .insert({ url_id: urlId, user_agent: userAgent, referrer: referrer });

  const { error } = await supabase.rpc('increment_url_clicks', { url_id: urlId });

  if (error) {
    await supabase
      .from('urls')
      .update({ clicks: supabase.sql`clicks + 1` })
      .eq('id', urlId);
  }
}

export async function getUrlClicks(urlId: string) {
  const { data, error } = await supabase
    .from('url_clicks')
    .select('*')
    .eq('url_id', urlId)
    .order('clicked_at', { ascending: false });

  return { data, error };
}
