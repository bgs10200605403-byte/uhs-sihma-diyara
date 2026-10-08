// Deploy with: supabase functions deploy contact-email
// Set secrets: RESEND_API_KEY, SCHOOL_EMAIL
// The Resend API key must NEVER be placed in GitHub/frontend code.
Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();
    if (!name || !message) return Response.json({ error: 'Name and message are required.' }, { status: 400 });
    if (name.length > 120 || message.length > 5000 || email.length > 200 || phone.length > 30) return Response.json({ error: 'Input too long.' }, { status: 400 });
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const schoolEmail = Deno.env.get('SCHOOL_EMAIL');
    if (!apiKey || !schoolEmail) return Response.json({ error: 'Email service is not configured.' }, { status: 503 });
    const html = `<h2>New contact enquiry — UHS Sihma Diyara</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Phone:</b> ${escapeHtml(phone)}</p><p><b>Message:</b><br>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`;
    const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'}, body:JSON.stringify({from:'UHS Sihma Diyara Website <onboarding@resend.dev>',to:[schoolEmail],reply_to: email || undefined,subject:`New website enquiry from ${name}`,html}) });
    const result = await r.json();
    if (!r.ok) return Response.json({ error: result?.message || 'Email failed.' }, { status: 502 });
    return Response.json({ ok:true });
  } catch (e) { return Response.json({ error:'Invalid request.' }, { status:400 }); }
});
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
