(async function(){
const db=window.uhsSupabase, loginBox=document.getElementById('loginBox'), dashboard=document.getElementById('dashboard'), warning=document.getElementById('configWarning');
if(!db){warning.hidden=false; return;}
const $=id=>document.getElementById(id); const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const date=s=>{try{return new Intl.DateTimeFormat('hi-IN',{dateStyle:'medium'}).format(new Date(s+'T00:00:00'));}catch{return s||''}};
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();$('loginMsg').textContent='Login हो रहा है…';const {error}=await db.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});$('loginMsg').textContent=error?error.message:'Login सफल';if(!error)show();});
$('logoutBtn').addEventListener('click',async()=>{await db.auth.signOut();location.reload()});
$('noticeForm').addEventListener('submit',async e=>{e.preventDefault();const {error}=await db.from('notices').insert({title:$('noticeTitle').value.trim(),category:$('noticeCategory').value,notice_date:$('noticeDate').value,description:$('noticeDescription').value.trim(),pdf_url:$('noticePdf').value.trim()||null,is_published:$('noticePublished').checked});$('noticeMsg').textContent=error?error.message:'सूचना सफलतापूर्वक save हो गई।';if(!error){e.target.reset();$('noticePublished').checked=true;await loadAll();}});
async function show(){loginBox.hidden=true;dashboard.hidden=false;await loadAll()}
async function loadAll(){
const [{data:n},{data:c},{data:a}]=await Promise.all([db.from('notices').select('*').order('notice_date',{ascending:false}),db.from('contact_messages').select('*').order('created_at',{ascending:false}),db.from('alumni_registrations').select('*').order('created_at',{ascending:false})]);
$('noticeCount').textContent=n?.length??0;$('contactCount').textContent=c?.length??0;$('alumniCount').textContent=a?.length??0;
$('adminNotices').innerHTML=(n||[]).map(x=>`<div class="notice-item"><span class="tag">${esc(x.category)}</span><strong>${esc(x.title)}</strong><small>${date(x.notice_date)} • ${x.is_published?'Published':'Draft'} ${x.pdf_url?`• <a href="${esc(x.pdf_url)}" target="_blank" rel="noopener">PDF</a>`:''}</small><button class="btn danger small" data-delete-notice="${x.id}">Delete</button></div>`).join('')||'<div class="notice-note">कोई सूचना नहीं।</div>';
$('contacts').innerHTML=table(c,['name','email','phone','message','status','created_at']);$('alumni').innerHTML=table(a,['name','passing_year','class_name','email','phone','profession','city','status','created_at']);
document.querySelectorAll('[data-delete-notice]').forEach(b=>b.onclick=async()=>{if(!confirm('इस सूचना को हटाएँ?'))return;await db.from('notices').delete().eq('id',b.dataset.deleteNotice);await loadAll();});
}
function table(rows,cols){if(!rows?.length)return '<div class="notice-note">अभी कोई रिकॉर्ड नहीं है।</div>';return `<div class="scroll-table"><table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c]??'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
const {data:{session}}=await db.auth.getSession(); if(session)show();
})();
