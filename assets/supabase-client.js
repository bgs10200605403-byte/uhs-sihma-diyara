(function () {
  const url = window.UHS_SUPABASE_URL;
  const key = window.UHS_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('YOUR-PROJECT') || key.includes('YOUR-SUPABASE')) {
    window.uhsSupabase = null;
    return;
  }
  if (!window.supabase) return;
  window.uhsSupabase = window.supabase.createClient(url, key);
})();
