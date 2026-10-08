(async function () {
  const db = window.uhsSupabase;
  const noticeRoot = document.querySelector('[data-notices-root]');
  if (!db || !noticeRoot) return;
  const { data, error } = await db.from('notices').select('*').eq('is_published', true).order('notice_date', { ascending: false });
  if (error) { console.warn('Notice loading failed:', error.message); return; }
  if (!data || !data.length) {
    noticeRoot.innerHTML = '<div class="notice-note">अभी कोई प्रकाशित सूचना उपलब्ध नहीं है।</div>';
    return;
  }
  noticeRoot.innerHTML = data.map(n => `<a class="notice-item" ${n.pdf_url ? `href="${escapeHtml(n.pdf_url)}" target="_blank" rel="noopener"` : ''}><span class="tag">${escapeHtml(n.category)}</span><strong>${escapeHtml(n.title)}</strong><small>${formatDate(n.notice_date)}${n.description ? ' • ' + escapeHtml(n.description) : ''}</small></a>`).join('');
  function escapeHtml(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function formatDate(v) { try { return new Intl.DateTimeFormat('hi-IN', {dateStyle:'medium'}).format(new Date(v + 'T00:00:00')); } catch { return v; } }
})();
